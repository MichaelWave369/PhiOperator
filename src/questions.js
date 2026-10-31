// Content is deliberately non-personal. Questions evaluate choices, not people.
export const PILLARS = Object.freeze(['OBSERVE', 'VERIFY', 'RECOVER']);

export const QUESTIONS = Object.freeze([
  {
    id: 'freeze',
    pillar: 'OBSERVE',
    location: 'THE FROZEN TERMINAL',
    prompt: 'Your screen appears frozen. What is the best first move?',
    choices: [
      { id: 'observe-before-force', text: 'Check whether the whole system or only one app is stuck.' },
      { id: 'yell-at-silicon', text: 'Yell at the silicon until it admits fault.' },
      { id: 'pull-power', text: 'Immediately unplug everything, including the lamp.' }
    ],
    correctId: 'observe-before-force',
    explanation: 'Check scope first. A single hung app often needs a different response from a frozen operating system.',
    quip: 'DIAGNOSTIC NOTE: Screaming is not a supported input device.'
  },
  {
    id: 'ai-answer',
    pillar: 'VERIFY',
    location: 'THE CONFIDENT ORACLE',
    prompt: 'An AI gives you a very confident answer to an important question. Now what?',
    choices: [
      { id: 'believe-the-glow', text: 'Believe it. The screen used bold text.' },
      { id: 'cross-check', text: 'Check the claim against reliable sources and primary evidence.' },
      { id: 'delete-all-tools', text: 'Destroy all calculators and return to the abacus.' }
    ],
    correctId: 'cross-check',
    explanation: 'Fluent answers can still be wrong. Verify consequential information regardless of whether it came from AI or a human.',
    quip: 'CERTAINTY DETECTED. EVIDENCE STILL REQUIRED.'
  },
  {
    id: 'popup',
    pillar: 'VERIFY',
    location: 'THE PATCH MERCHANT',
    prompt: 'A surprise popup orders you to install a critical update from a strange link. What do you do?',
    choices: [
      { id: 'click-shiny', text: 'Click immediately. Urgent fonts never lie.' },
      { id: 'check-official', text: 'Use the app or vendor’s official update channel to verify.' },
      { id: 'forward-friends', text: 'Forward it to friends for community panic.' }
    ],
    correctId: 'check-official',
    explanation: 'Unexpected update prompts can be malicious. Verify the release through a trusted, official channel.',
    quip: 'CONGRATULATIONS. YOU FOUND THE OPTIONAL MALWARE QUEST.'
  },
  {
    id: 'storage',
    pillar: 'OBSERVE',
    location: 'THE FULL DISK',
    prompt: 'Your computer reports very little free storage. Your first response?',
    choices: [
      { id: 'inspect-usage', text: 'Inspect what is using space before deleting anything.' },
      { id: 'delete-system', text: 'Delete the system directory. It sounds optional.' },
      { id: 'blame-moon', text: 'Attribute it to unusual lunar activity.' }
    ],
    correctId: 'inspect-usage',
    explanation: 'Measure the issue first. Storage tools help distinguish caches, downloads, and important data.',
    quip: 'CAUTION: The operating system is not a temporary file.'
  },
  {
    id: 'teammate',
    pillar: 'RECOVER',
    location: 'THE NEW APPRENTICE',
    prompt: 'Someone asks a basic question about a tool you know well. What is the best response?',
    choices: [
      { id: 'mock-them', text: 'Mock them publicly. That definitely helps adoption.' },
      { id: 'clear-example', text: 'Give a clear example and let them try it safely.' },
      { id: 'close-issue', text: 'Close the issue with the words “skill issue”.' }
    ],
    correctId: 'clear-example',
    explanation: 'Clarity and patient examples are how new operators become confident ones.',
    quip: 'TEAMWORK MODULE HAS FAILED TO DETECT THE BENEFIT OF INSULTS.'
  },
  {
    id: 'backup',
    pillar: 'RECOVER',
    location: 'THE FALSE SAFETY NET',
    prompt: 'You have just backed up an important project. How do you know it is useful?',
    choices: [
      { id: 'see-folder', text: 'A folder named BACKUP exists. Case closed.' },
      { id: 'trust-vibes', text: 'Trust that the electrons understood your intent.' },
      { id: 'test-restore', text: 'Verify contents and test restoring a sample safely.' }
    ],
    correctId: 'test-restore',
    explanation: 'Backups only earn their reputation when restoration works. Verify and test before an emergency.',
    quip: 'BACKUP LABEL IS NOT A BACKUP STRATEGY.'
  },
  {
    id: 'password',
    pillar: 'VERIFY',
    location: 'THE PASSWORD GOBLIN',
    prompt: 'A “support agent” asks you to send your password by message. Choose wisely.',
    choices: [
      { id: 'refuse-and-verify', text: 'Refuse and use an authenticated support channel.' },
      { id: 'send-password', text: 'Send it along with your favorite security question answer.' },
      { id: 'post-publicly', text: 'Post it publicly so support can find it faster.' }
    ],
    correctId: 'refuse-and-verify',
    explanation: 'Legitimate support should not need your password. Use official channels, and never share secrets in chats.',
    quip: 'SECURITY ALERT: Your password is not a community resource.'
  },
  {
    id: 'automation',
    pillar: 'OBSERVE',
    location: 'THE ONE-LINE SPELL',
    prompt: 'A script you found online promises to clean your PC. Before running it?',
    choices: [
      { id: 'review-and-sandbox', text: 'Read what it does, verify the source, and test safely.' },
      { id: 'run-admin', text: 'Run as administrator immediately, for maximum confidence.' },
      { id: 'rename-magic', text: 'Rename it FIX_EVERYTHING and double-click twice.' }
    ],
    correctId: 'review-and-sandbox',
    explanation: 'Unknown scripts may delete files or exfiltrate data. Review, back up, and use least privilege.',
    quip: 'THE ARCANE SPELL APPEARS TO CONTAIN rm -rf.'
  },
  {
    id: 'y2k',
    pillar: 'RECOVER',
    location: 'THE Y2K WISHING WELL',
    prompt: 'A stranger declares: “I wish Y2K had taken out all the computers.” Your response?',
    choices: [
      { id: 'emergency-boot', text: 'Dramatically boot a fake DOS screen and whisper “wish granted”.' },
      { id: 'ban-questions', text: 'Declare all criticism illegal on the internet.' },
      { id: 'curious-response', text: 'Ask what frustrates them, then offer a useful alternative.' }
    ],
    correctId: 'curious-response',
    explanation: 'Even a sweeping anti-tech complaint can point to a real frustration. Listening is more useful than gatekeeping.',
    quip: 'C:\> HUMAN_CONVERSATION.EXE HAS ENCOUNTERED AN UNEXPECTED OPPORTUNITY.'
  }
].map(question => Object.freeze({
  ...question,
  choices: Object.freeze(question.choices.map(choice => Object.freeze(choice)))
})));

export const QUESTION_IDS = Object.freeze(QUESTIONS.map(question => question.id));