import type { Locale } from "@/i18n/config";
import type { ProfileKey } from "@/lib/regenerationscheck";

export type QuestionContent = { id: string; text: string };

export type ResultContent = {
  title: string;
  intro: string;
  ritualLabel: string;
  ritualPoints: string;
  ritualLine: string;
  productLabel: string;
  cta: string;
  addonLabel: string; // "Kann dein Ritual ergänzen: {addon}"
};

export type QuizContent = {
  startEyebrow: string;
  startTitle: string;
  startIntro1: string;
  startIntro2: string;
  startIntro3: string;
  startButton: string;
  startNote: string;
  questionIntro: string;
  scaleLabels: [string, string, string, string, string]; // 0..4
  progressLabel: string; // "{current} von {total}"
  next: string;
  back: string;
  transitionTitle: string;
  transitionCopy: string;
  transitionButton: string;
  questions: QuestionContent[];
  results: Record<ProfileKey, ResultContent>;
  lowScoreResult: {
    title: string;
    intro: string;
    recommendation: string;
    cta: string;
  };
  secondaryHeading: string;
  restart: string;
  disclaimer: string;
};

const de: QuizContent = {
  startEyebrow: "Regenerationscheck",
  startTitle: "Was brauchst du gerade?",
  startIntro1:
    "Regeneration beginnt mit dem Moment, in dem du wahrnimmst, was dir fehlt.",
  startIntro2:
    "Unser Alltag fordert uns auf unterschiedliche Weise. Manchmal sind es die Gedanken, die nicht zur Ruhe kommen. Manchmal fehlt Energie. Manchmal fällt es schwer, loszulassen oder am Abend wirklich abzuschalten.",
  startIntro3:
    "Der SomnoBalance Regenerationscheck hilft dir, deinen aktuellen Schwerpunkt bewusster wahrzunehmen. 20 kurze Fragen. Ein persönlicher Regenerationsimpuls. Ein Ritual, das zu deinem Alltag passt.",
  startButton: "Mein Ritual entdecken",
  startNote:
    "Dauer ca. 3 Minuten. Der Check dient der persönlichen Orientierung und ersetzt keine medizinische oder psychologische Diagnostik.",
  questionIntro:
    "Wie fühlt sich dein Alltag gerade an? Es gibt kein Richtig oder Falsch. Wähle die Antwort, die deinem momentanen Erleben am nächsten kommt.",
  scaleLabels: ["Gar nicht", "Selten", "Manchmal", "Häufig", "Sehr häufig"],
  progressLabel: "{current} von {total}",
  next: "Weiter",
  back: "Zurück",
  transitionTitle: "Ein Moment für dich.",
  transitionCopy:
    "Deine Antworten ergeben ein ganz persönliches Bild. SomnoBalance verbindet daraus die Regenerationsimpulse, die im Moment am besten zu deinem Alltag passen.",
  transitionButton: "Mein Ergebnis entdecken",
  questions: [
    { id: "q01", text: "Wenn der Tag ruhiger wird, fällt es mir trotzdem schwer, innerlich abzuschalten." },
    { id: "q02", text: "Auch wenn außen Ruhe ist, sind meine Gedanken noch lange aktiv." },
    { id: "q03", text: "Am Abend brauche ich lange, bis ich wirklich zur Ruhe komme und einschlafen kann." },
    { id: "q04", text: "Am Morgen wünsche ich mir häufiger, erholter und regenerierter aufzuwachen." },
    { id: "q05", text: "Im Alltag fehlt mir häufiger die Energie, die ich eigentlich gerne hätte." },
    { id: "q06", text: "Meine Kraftreserven fühlen sich schneller aufgebraucht an, als mir guttut." },
    { id: "q07", text: "Wenn vieles gleichzeitig auf mich zukommt, verliere ich schnell meine innere Ruhe." },
    { id: "q08", text: "Nach anstrengenden Situationen brauche ich länger, bis ich mich wieder ausgeglichener fühle." },
    { id: "q09", text: "Manche Situationen beschäftigen mich emotional noch lange, nachdem sie eigentlich vorbei sind." },
    { id: "q10", text: "Es fällt mir schwer, Ärger, Enttäuschungen oder belastende Gefühle innerlich loszulassen." },
    { id: "q11", text: "Manche Gedanken kehren immer wieder zurück, obwohl ich sie gerne ruhen lassen würde." },
    { id: "q12", text: "Ich ertappe mich dabei, dieselben Situationen, Fragen oder Möglichkeiten immer wieder durchzugehen." },
    { id: "q13", text: "Wenn es schwierig wird, verliere ich schneller mein Gefühl von innerer Sicherheit." },
    { id: "q14", text: "Gerade in herausfordernden Momenten wünsche ich mir mehr Stabilität und Vertrauen in mich selbst." },
    { id: "q15", text: "Wenn viele Gedanken gleichzeitig da sind, fällt es mir schwerer, klare Entscheidungen zu treffen." },
    { id: "q16", text: "Bei vielen Informationen oder Möglichkeiten verliere ich manchmal den Blick für das, was gerade wirklich wichtig ist." },
    { id: "q17", text: "Ich habe häufig das Gefühl, innerlich unter Strom zu stehen." },
    { id: "q18", text: "Kleine Dinge bringen mich schneller aus meiner Ruhe, als ich es eigentlich möchte." },
    { id: "q19", text: "Bewusste Momente nur für meine eigene Regeneration kommen in meinem Alltag häufig zu kurz." },
    { id: "q20", text: "Ich wünsche mir ein einfaches Ritual, das mir hilft, im Alltag immer wieder bewusst innezuhalten." },
  ],
  results: {
    ruhe: {
      title: "Ruhe finden",
      intro:
        "Wenn es außen still wird, aber innen noch viel passiert. Ein voller Tag endet nicht immer dann, wenn die Aufgaben erledigt sind. Gedanken bleiben. Eindrücke wirken nach. Der Kopf ist noch unterwegs, obwohl du längst zur Ruhe kommen möchtest. Deine Antworten zeigen, dass bewusstes Abschalten und mentale Ruhe im Moment besonders viel Raum in deinem Alltag einnehmen.",
      ritualLabel: "Dein Ritual",
      ritualPoints: "Geist sammeln · Gedanken beruhigen · Neue Perspektiven finden",
      ritualLine: "Nicht mehr leisten. Nicht mehr lösen. Für einen Augenblick einfach ankommen.",
      productLabel: "Für deinen Moment",
      cta: "Regenerationskarten entdecken",
      addonLabel: "Kann dein Ritual ergänzen: {addon}",
    },
    schlaf: {
      title: "Erholsam schlafen",
      intro:
        "Wenn der Tag endet, darf auch das Tun enden. Manchmal liegt der Körper längst im Bett, während der Tag innerlich noch weitergeht. Gedanken sind noch da. Anspannung klingt nach. Und aus dem Wunsch, endlich schlafen zu müssen, entsteht noch mehr Unruhe. Deine Antworten zeigen, dass der Übergang vom Tag in die Nacht im Moment mehr Aufmerksamkeit bekommen darf.",
      ritualLabel: "Dein Ritual",
      ritualPoints: "Schlaf finden · Herz beruhigen · Erdung finden",
      ritualLine: "Nicht schlafen müssen. Erst einmal nur zur Ruhe kommen.",
      productLabel: "Für deinen Moment",
      cta: "Abendritual entdecken",
      addonLabel: "Kann dein Abendritual ergänzen: {addon}",
    },
    kraft: {
      title: "Neue Kraft schöpfen",
      intro:
        "Manchmal braucht neue Kraft zuerst eine Pause. Wenn der Alltag viel fordert, kann irgendwann das Gefühl entstehen, ständig aus den eigenen Reserven zu leben. Du funktionierst. Du erledigst. Du machst weiter. Deine Antworten zeigen, dass bewusste Regeneration und neue Energie im Moment mehr Raum bekommen dürfen.",
      ritualLabel: "Dein Ritual",
      ritualPoints: "Innere Mitte stärken · Kraft schöpfen · Erdung finden",
      ritualLine: "Ein Moment zum Innehalten. Damit aus Pause wieder Kraft werden darf.",
      productLabel: "Für deinen Moment",
      cta: "Regenerationskarten entdecken",
      addonLabel: "Kann dein Ritual ergänzen: {addon}",
    },
    balance: {
      title: "Innere Balance",
      intro:
        "Wenn vieles gleichzeitig da ist, darfst du wieder bei dir beginnen. Termine. Erwartungen. Entscheidungen. Menschen. Manchmal wird das Außen so laut, dass es schwerer wird, die eigene Mitte noch wahrzunehmen. Deine Antworten zeigen, dass innere Ruhe und Stabilität gerade besonders wichtig für dich sein könnten.",
      ritualLabel: "Dein Ritual",
      ritualPoints: "Innere Mitte stärken · Inneren Halt finden · Gelassenheit finden · Erdung finden",
      ritualLine: "Nicht alles gleichzeitig lösen. Erst einmal wieder ankommen.",
      productLabel: "Für deinen Moment",
      cta: "Dein Ritual entdecken",
      addonLabel: "Kann dein Ritual ergänzen: {addon}",
    },
    emotionen: {
      title: "Emotionen loslassen",
      intro:
        "Nicht alles, was dich berührt, muss bei dir bleiben. Manche Begegnungen sind längst vorbei und wirken trotzdem nach. Ein Gespräch. Eine Enttäuschung. Ein Konflikt. Ein Gefühl, das sich nicht einfach abschütteln lässt. Deine Antworten zeigen, dass emotionales Loslassen im Moment ein wichtiger Regenerationsbereich für dich sein kann.",
      ritualLabel: "Dein Ritual",
      ritualPoints: "Herz beruhigen · Emotionen loslassen · Erdung finden",
      ritualLine: "Nicht verdrängen. Nicht verändern müssen. Wahrnehmen. Und wieder Raum entstehen lassen.",
      productLabel: "Für deinen Moment",
      cta: "Roll-on entdecken",
      addonLabel: "Kann dein Ritual ergänzen: {addon}",
    },
    gedanken: {
      title: "Gedanken loslassen",
      intro:
        "Nicht jeder Gedanke braucht eine Antwort. Manche Gedanken kommen einmal. Andere kommen immer wieder. Wir suchen Lösungen, spielen Situationen erneut durch oder versuchen, etwas zu verstehen, das sich gerade vielleicht gar nicht lösen lässt. Deine Antworten zeigen, dass Gedanken und Grübeln im Moment viel Raum einnehmen.",
      ritualLabel: "Dein Ritual",
      ritualPoints: "Geist sammeln · Gedanken beruhigen · Neue Perspektiven finden · Herz beruhigen",
      ritualLine: "Du musst einen Gedanken nicht festhalten, nur weil er da ist. Manches darf einfach weiterziehen.",
      productLabel: "Für deinen Moment",
      cta: "Regenerationskarten entdecken",
      addonLabel: "Kann dein Ritual ergänzen: {addon}",
    },
    halt: {
      title: "Inneren Halt finden",
      intro:
        "Stabilität beginnt nicht immer im Außen. Es gibt Zeiten, in denen Gewohntes plötzlich weniger sicher erscheint. Entscheidungen werden schwieriger. Veränderungen verunsichern. Deine Antworten zeigen, dass innere Sicherheit und Vertrauen gerade mehr Aufmerksamkeit bekommen dürfen.",
      ritualLabel: "Dein Ritual",
      ritualPoints: "Herz beruhigen · Inneren Halt finden · Gelassenheit finden · Erdung finden",
      ritualLine: "Nicht alles im Außen muss sicher sein. Manchmal genügt es, wieder einen festen Punkt in sich selbst zu finden.",
      productLabel: "Für deinen Moment",
      cta: "Deine Regenerationspunkte entdecken",
      addonLabel: "Kann dein Ritual ergänzen: {addon}",
    },
    klarheit: {
      title: "Klarheit gewinnen",
      intro:
        "Manchmal entsteht Klarheit erst, wenn es ruhiger wird. Je mehr Möglichkeiten wir haben, desto schwieriger kann es werden, zu erkennen, was wirklich wichtig ist. Gedanken überlagern sich. Entscheidungen werden vertagt. Deine Antworten zeigen, dass Klarheit und Orientierung gerade einen besonderen Stellenwert für dich haben.",
      ritualLabel: "Dein Ritual",
      ritualPoints: "Geist sammeln · Neue Perspektiven finden · Klar sehen · Gelassenheit finden",
      ritualLine: "Du musst nicht sofort die ganze Antwort kennen. Manchmal reicht der nächste klare Schritt.",
      productLabel: "Für deinen Moment",
      cta: "Ritual entdecken",
      addonLabel: "Kann dein Ritual ergänzen: {addon}",
    },
    gelassenheit: {
      title: "Gelassen durch den Tag",
      intro:
        "Zwischen all dem, was passiert, darf auch Raum für dich bleiben. Ein voller Kalender. Viele Reize. Menschen, die etwas brauchen. Dinge, die erledigt werden wollen. Irgendwann entsteht das Gefühl: Ich bin ständig unter Strom. Deine Antworten zeigen, dass Anspannung und Gelassenheit im Alltag momentan ein wichtiger Schwerpunkt für dich sind.",
      ritualLabel: "Dein Ritual",
      ritualPoints: "Geist sammeln · Gelassenheit finden · Neue Leichtigkeit · Erdung finden",
      ritualLine: "Du musst nicht warten, bis alles erledigt ist. Ruhe darf auch zwischendurch stattfinden.",
      productLabel: "Für deinen Moment",
      cta: "Roll-on entdecken",
      addonLabel: "Kann dein Ritual ergänzen: {addon}",
    },
    regeneration: {
      title: "Regeneration aktivieren",
      intro:
        "Zeit für dich ist kein Gegenpol zum Alltag. Sie gehört dazu. Oft warten wir mit Erholung, bis alles andere erledigt ist. Nur ist selten alles erledigt. Deine Antworten zeigen deshalb weniger ein einzelnes Thema als einen Wunsch: Regeneration wieder bewusster in deinen Alltag zu integrieren.",
      ritualLabel: "Dein Ritual",
      ritualPoints: "Innere Mitte stärken · Kraft schöpfen · Herz beruhigen · Erdung finden",
      ritualLine: "Ein paar Minuten. Ein wiederkehrender Moment. Etwas, das nur dir gehört.",
      productLabel: "Für deinen Moment",
      cta: "Starter-Set entdecken",
      addonLabel: "Kann dein Ritual ergänzen: {addon}",
    },
  },
  lowScoreResult: {
    title: "Deine Balance bewusst bewahren",
    intro:
      "Manchmal geht es nicht darum, etwas zu verändern. Sondern darum, das zu bewahren, was bereits trägt. Deine Antworten zeigen aktuell keinen einzelnen Bereich, der deutlich im Vordergrund steht. Das kann ein guter Moment sein, Regeneration nicht erst dann Raum zu geben, wenn der Alltag zu viel wird, sondern sie als selbstverständlichen Teil deines Tages zu pflegen.",
    recommendation:
      "Empfehlung: Regenerationskarten-Set als Inspiration für kleine, frei gewählte Regenerationsmomente.",
    cta: "Regeneration entdecken",
  },
  secondaryHeading: "Ein weiterer Bereich, der in deinen Antworten sichtbar wird",
  restart: "Check erneut starten",
  disclaimer:
    "Der SomnoBalance Regenerationscheck ist ein nicht validierter Selbstreflexions- und Wellness-Check. Er ersetzt keine medizinische oder psychologische Diagnostik.",
};

const en: QuizContent = {
  startEyebrow: "Regeneration Check",
  startTitle: "What do you need right now?",
  startIntro1: "Regeneration begins the moment you notice what's missing.",
  startIntro2:
    "Everyday life makes demands on us in different ways. Sometimes it's thoughts that won't settle. Sometimes energy is missing. Sometimes it's hard to let go, or to truly switch off in the evening.",
  startIntro3:
    "The SomnoBalance Regeneration Check helps you notice your current focus more consciously. 20 short questions. A personal regeneration impulse. A ritual that fits your everyday life.",
  startButton: "Discover my ritual",
  startNote:
    "Takes about 3 minutes. This check is for personal orientation only and does not replace medical or psychological diagnosis.",
  questionIntro:
    "How does your everyday life feel right now? There's no right or wrong answer — choose whichever comes closest to how you feel at the moment.",
  scaleLabels: ["Not at all", "Rarely", "Sometimes", "Often", "Very often"],
  progressLabel: "{current} of {total}",
  next: "Next",
  back: "Back",
  transitionTitle: "A moment for you.",
  transitionCopy:
    "Your answers form a very personal picture. SomnoBalance combines them into the regeneration impulses that best fit your everyday life right now.",
  transitionButton: "Discover my result",
  questions: [
    { id: "q01", text: "Even when the day gets quieter, I still find it hard to switch off inside." },
    { id: "q02", text: "Even when it's quiet around me, my thoughts stay active for a long time." },
    { id: "q03", text: "In the evening, it takes me a long time to really settle down and fall asleep." },
    { id: "q04", text: "In the morning, I often wish I felt more rested and regenerated." },
    { id: "q05", text: "In everyday life, I often lack the energy I'd actually like to have." },
    { id: "q06", text: "My reserves feel used up faster than is good for me." },
    { id: "q07", text: "When a lot comes at me at once, I quickly lose my inner calm." },
    { id: "q08", text: "After demanding situations, it takes me longer to feel balanced again." },
    { id: "q09", text: "Some situations stay with me emotionally long after they're actually over." },
    { id: "q10", text: "It's hard for me to let go of anger, disappointment, or difficult feelings." },
    { id: "q11", text: "Some thoughts keep coming back, even though I'd like to let them rest." },
    { id: "q12", text: "I catch myself going over the same situations, questions, or options again and again." },
    { id: "q13", text: "When things get difficult, I quickly lose my sense of inner security." },
    { id: "q14", text: "Especially in challenging moments, I wish for more stability and trust in myself." },
    { id: "q15", text: "When many thoughts are present at once, it's harder for me to make clear decisions." },
    { id: "q16", text: "With a lot of information or options, I sometimes lose sight of what's actually important." },
    { id: "q17", text: "I often feel like I'm constantly under pressure inside." },
    { id: "q18", text: "Small things throw me off balance faster than I'd like." },
    { id: "q19", text: "Conscious moments just for my own regeneration often fall short in my everyday life." },
    { id: "q20", text: "I wish for a simple ritual that helps me pause consciously, again and again, in everyday life." },
  ],
  results: {
    ruhe: {
      title: "Finding calm",
      intro:
        "When it goes quiet outside, but a lot is still happening inside. A full day doesn't always end when the tasks are done. Thoughts remain. Impressions linger. Your mind is still travelling, even though you'd like to settle. Your answers show that consciously switching off and mental calm currently take up a lot of space in your everyday life.",
      ritualLabel: "Your ritual",
      ritualPoints: "Gathering the mind · Calming thoughts · Finding new perspectives",
      ritualLine: "Nothing left to achieve. Nothing left to solve. Just arriving, for a moment.",
      productLabel: "For your moment",
      cta: "Discover the regeneration cards",
      addonLabel: "Can complement your ritual: {addon}",
    },
    schlaf: {
      title: "Sleeping well",
      intro:
        "When the day ends, doing can end too. Sometimes the body has long been in bed while the day still carries on inside. Thoughts remain. Tension lingers. And the wish to finally fall asleep can create even more restlessness. Your answers show that the transition from day into night could use more attention right now.",
      ritualLabel: "Your ritual",
      ritualPoints: "Finding sleep · Calming the heart · Finding grounding",
      ritualLine: "No need to sleep yet. First, just arrive at rest.",
      productLabel: "For your moment",
      cta: "Discover the evening ritual",
      addonLabel: "Can complement your evening ritual: {addon}",
    },
    kraft: {
      title: "Finding new strength",
      intro:
        "Sometimes new strength needs a pause first. When everyday life asks a lot of you, the feeling can arise that you're constantly living off your own reserves. You function. You get things done. You keep going. Your answers show that conscious regeneration and new energy could use more space right now.",
      ritualLabel: "Your ritual",
      ritualPoints: "Strengthening your inner centre · Gathering strength · Finding grounding",
      ritualLine: "A moment to pause — so that rest can become strength again.",
      productLabel: "For your moment",
      cta: "Discover the regeneration cards",
      addonLabel: "Can complement your ritual: {addon}",
    },
    balance: {
      title: "Inner balance",
      intro:
        "When a lot is happening at once, you're allowed to begin with yourself again. Appointments. Expectations. Decisions. People. Sometimes the outside world gets so loud that it becomes harder to sense your own centre. Your answers show that inner calm and stability could be especially important for you right now.",
      ritualLabel: "Your ritual",
      ritualPoints: "Strengthening your inner centre · Finding inner steadiness · Finding ease · Finding grounding",
      ritualLine: "No need to solve everything at once. First, just arrive again.",
      productLabel: "For your moment",
      cta: "Discover your ritual",
      addonLabel: "Can complement your ritual: {addon}",
    },
    emotionen: {
      title: "Letting go of emotions",
      intro:
        "Not everything that touches you has to stay with you. Some encounters are long over and still linger. A conversation. A disappointment. A conflict. A feeling that won't simply shake off. Your answers show that emotional release could be an important area of regeneration for you right now.",
      ritualLabel: "Your ritual",
      ritualPoints: "Calming the heart · Letting go of emotions · Finding grounding",
      ritualLine: "No need to suppress it. No need to change it. Notice it — and let space open again.",
      productLabel: "For your moment",
      cta: "Discover the roll-on",
      addonLabel: "Can complement your ritual: {addon}",
    },
    gedanken: {
      title: "Letting go of thoughts",
      intro:
        "Not every thought needs an answer. Some thoughts come once. Others keep returning. We look for solutions, replay situations, or try to understand something that perhaps can't be resolved right now. Your answers show that thinking and rumination currently take up a lot of space.",
      ritualLabel: "Your ritual",
      ritualPoints: "Gathering the mind · Calming thoughts · Finding new perspectives · Calming the heart",
      ritualLine: "You don't have to hold on to a thought just because it's there. Some things are allowed to simply move on.",
      productLabel: "For your moment",
      cta: "Discover the regeneration cards",
      addonLabel: "Can complement your ritual: {addon}",
    },
    halt: {
      title: "Finding inner steadiness",
      intro:
        "Stability doesn't always begin on the outside. There are times when the familiar suddenly feels less certain. Decisions become harder. Change unsettles. Your answers show that inner security and trust could use more attention right now.",
      ritualLabel: "Your ritual",
      ritualPoints: "Calming the heart · Finding inner steadiness · Finding ease · Finding grounding",
      ritualLine: "Not everything on the outside needs to be certain. Sometimes it's enough to find one steady point within yourself again.",
      productLabel: "For your moment",
      cta: "Discover your regeneration points",
      addonLabel: "Can complement your ritual: {addon}",
    },
    klarheit: {
      title: "Gaining clarity",
      intro:
        "Sometimes clarity only emerges once things get quieter. The more options we have, the harder it can become to recognise what really matters. Thoughts overlap. Decisions get postponed. Your answers show that clarity and orientation hold particular importance for you right now.",
      ritualLabel: "Your ritual",
      ritualPoints: "Gathering the mind · Finding new perspectives · Seeing clearly · Finding ease",
      ritualLine: "You don't need the whole answer right away. Sometimes the next clear step is enough.",
      productLabel: "For your moment",
      cta: "Discover the ritual",
      addonLabel: "Can complement your ritual: {addon}",
    },
    gelassenheit: {
      title: "Moving through the day with ease",
      intro:
        "Between everything that's happening, there's still room for you. A full calendar. Many stimuli. People who need something. Things that want to get done. At some point, the feeling arises: I'm constantly under pressure. Your answers show that tension and ease are currently an important focus in your everyday life.",
      ritualLabel: "Your ritual",
      ritualPoints: "Gathering the mind · Finding ease · New lightness · Finding grounding",
      ritualLine: "You don't have to wait until everything is done. Rest is allowed in between, too.",
      productLabel: "For your moment",
      cta: "Discover the roll-on",
      addonLabel: "Can complement your ritual: {addon}",
    },
    regeneration: {
      title: "Activating regeneration",
      intro:
        "Time for yourself isn't the opposite of everyday life. It's part of it. We often wait to rest until everything else is done — but everything is rarely done. Your answers show, then, less a single theme than a wish: to bring regeneration back into your everyday life, more consciously.",
      ritualLabel: "Your ritual",
      ritualPoints: "Strengthening your inner centre · Gathering strength · Calming the heart · Finding grounding",
      ritualLine: "A few minutes. A recurring moment. Something that belongs only to you.",
      productLabel: "For your moment",
      cta: "Discover the starter set",
      addonLabel: "Can complement your ritual: {addon}",
    },
  },
  lowScoreResult: {
    title: "Consciously preserving your balance",
    intro:
      "Sometimes it isn't about changing something — it's about preserving what already carries you. Your answers don't currently show a single area that clearly stands out. This can be a good moment to give regeneration space before everyday life becomes too much, rather than only once it already has.",
    recommendation:
      "Recommendation: the regeneration card set as inspiration for small, freely chosen moments of regeneration.",
    cta: "Discover regeneration",
  },
  secondaryHeading: "Another area that shows up in your answers",
  restart: "Start the check again",
  disclaimer:
    "The SomnoBalance Regeneration Check is a non-validated self-reflection and wellness check. It does not replace medical or psychological diagnosis.",
};

export function getQuizContent(locale: Locale): QuizContent {
  return locale === "de" ? de : en;
}
