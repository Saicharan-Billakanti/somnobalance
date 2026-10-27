import bcrypt from "bcryptjs";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stdin, stdout } from "node:process";

const email = "admin@somnobalance.com";

function readHidden(prompt) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    throw new Error("Run this script in an interactive terminal so the password can be entered without echoing it.");
  }

  return new Promise((resolve, reject) => {
    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    let value = "";
    const onData = (buffer) => {
      const input = buffer.toString("utf8");
      if (input === "\u0003") {
        cleanup();
        reject(new Error("Cancelled."));
      } else if (input === "\r" || input === "\n") {
        cleanup();
        stdout.write("\n");
        resolve(value);
      } else if (input === "\u0008" || input === "\u007f") {
        if (value.length) {
          value = value.slice(0, -1);
          stdout.write("\b \b");
        }
      } else if (input.length === 1 && input >= " ") {
        value += input;
        stdout.write("*");
      }
    };
    function cleanup() {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
    }
    stdin.on("data", onData);
  });
}

let tempDir;
try {
  const password = await readHidden(`New password for ${email}: `);
  const confirmation = await readHidden("Confirm new password: ");
  if (password.length < 8 || password.length > 200) throw new Error("Password must be between 8 and 200 characters.");
  if (password !== confirmation) throw new Error("Passwords do not match.");

  const passwordHash = await bcrypt.hash(password, 12);
  tempDir = mkdtempSync(join(tmpdir(), "somnobalance-admin-"));
  const sqlFile = join(tempDir, `${randomUUID()}.sql`);
  const escapedHash = passwordHash.replaceAll("'", "''");
  writeFileSync(sqlFile, `UPDATE "User"
SET "passwordHash" = '${escapedHash}',
    "role" = 'admin',
    "emailVerifiedAt" = COALESCE("emailVerifiedAt", strftime('%Y-%m-%dT%H:%M:%fZ','now'))
WHERE LOWER("email") = LOWER('${email}')
RETURNING "email", "role";\n`, { mode: 0o600 });

  const cli = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(cli, ["wrangler", "d1", "execute", "somnobalance-db", "--remote", "--file", sqlFile, "--yes"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error("Wrangler failed to update the admin account.");
  console.log("Admin account updated. Confirm Wrangler reports one returned row with role admin.");
} catch (error) {
  console.error(error instanceof Error ? error.message : "Could not update the admin account.");
  process.exitCode = 1;
} finally {
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
}
