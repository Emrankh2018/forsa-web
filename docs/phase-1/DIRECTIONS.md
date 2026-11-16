# Phase 1 — two design directions

Both keep the fixed identity (paper, ink, maroon as the one accent on paper, night with sand, Amiri for display, IBM Plex Sans Arabic / IBM Plex Sans for text, the open-door logo, the first-line motif). Everything else differs: structure, shape language, motion and how the platform's areas are reached.

What we are not making again (the old site): a centred stack of sections, a headline beside a card, a row of four numbered steps, a row of three cards, a form, a dark footer band.

## Direction A — «العتبة» The threshold

**Idea.** The platform is a building and every area is a room behind a door. You arrive outside at night, the Forsa door opens, and you walk through into a lit hall. From then on every entry point is a doorway, and how far a door stands open always means something: how far along you are, how many seats are left.

**Shape.** The arch from the logo (`M70 262V132a80 80 0 0 1 160 0v130z`) is the one shape. Arched frames replace cards; square everything else. The dark door leaf covers part of each arch; the visible gap is lit maroon.

**Home.** A hall of three tall doorways side by side (projects, training, partners); each opening shows what is in the room right now (next open project, next workshop date). Below, "open now": projects as doors standing ajar, the gap width showing seats left. Phone: doorways in a row you swipe sideways.

**Project page.** You are inside the room: a wide arch frames the title; the brief, what to hand in and the work steps sit on the floor of the room; a narrow door on the side holds the facts and the one action (join, or apply).

**Participant home.** One big doorway with your next step written in its light; the leaf is opened as far as your active project has progressed. Your projects are small doors beside it, each opened to its own progress.

**Arrival.** Night. The door from the logo, closed. A line of light at the gap; the leaf swings open on its hinge, light falls on the floor; the view pushes through the opening (an arch-shaped mask grows) and the hall is underneath. About 2.4 s. Ends at once on any key, click, touch or scroll. Plays once per session.

```
 desktop home (RTL: start is on the right)
 ┌────────────────────────────────────────────┐
 │ forsa (door)                  en  sign in  │
 │                                            │
 │  promise, large Amiri, right-aligned       │
 │  ┌──╮  ┌──╮  ┌──╮   three tall doorways    │
 │  │▓ │  │▓ │  │▓ │   each a link, leaf ajar │
 │  │▓ │  │▓ │  │▓ │                          │
 │  └──┘  └──┘  └──┘                          │
 │  open now ─────                            │
 │  ╭╮ ╭╮ ╭╮ ╭╮  narrow doors, gap = seats    │
 └────────────────────────────────────────────┘
```

## Direction B — «السطر الأول» The first line

**Idea.** A CV with nothing on it. Forsa writes the first line. The whole platform is one long page that the participant fills in line by line: every project, workshop and certificate is a line written on it. No cards, no boxes: lines, a margin, and the maroon bar that marks where you are.

**Shape.** A wide margin on the start side (right in Arabic) holds section names and short facts, the way a CV holds dates; the content side is written on a quiet ruled baseline. The maroon bar sits in the margin at the current line.

**Home.** One line, written large on the first rule: the promise. Then entries, like CV entries: the company in the margin, the project title large, one line of what you hand in, the date at the line's end. Workshops the same way, with the price. Partners is a single paragraph with one link.

**Project page.** A document. The title is the first line; the brief in paragraphs; what you hand in as empty checkboxes on the rules; the company, join mode, seats and dates as margin notes. At the end an empty line waiting for your name, with the one action.

**Participant home.** Your page: what you have done is written in ink, the next step is the next empty line with the bar beside it, and the lines after it are faint until you get there.

**Arrival.** Blank paper. The door is drawn as a single line, arch first, then the floor; the floor stretches across the page and becomes the first line; the bar drops in at its start; the arch fades and the line settles where the page's first line sits. About 2 s, same ending rules.

```
 desktop home (RTL)
 ┌────────────────────────────────────────────┐
 │                       ▬──────────────────── │  ← the first line
 │  margin │ the promise, one large line       │
 │ ────────┼────────────────────────────────── │
 │ company │ project title, large              │
 │  date   │ what you hand in, one line        │
 │ ────────┼────────────────────────────────── │
 │ company │ project title                     │
 └────────────────────────────────────────────┘
```

## Shared rules (both)

- The page is always rendered underneath; the arrival is an overlay that never traps focus, never moves layout, has a CSS-only fail-safe (it removes itself even if scripts fail) and does not play under reduced motion. `?intro=1` replays it for review.
- Animate only transform, opacity, clip-path or masks.
- Signed-in screens (participant home) are calm tools: one motion moment at most.
- No stock photos, no invented statistics, no real organisation names. All projects, companies, workshops and the participant are fictional and labelled as sample data on screen.

## Review against the brief

- Checked for template chrome: no all-caps eyebrows, no "A · B · C" meta strings, no arrows on buttons, no monospace labels, no identical rounded cards with shadows, no numbered markers except the work steps (a real sequence).
- Cream + serif + one warm accent is a common generated look; here it is the owner's fixed identity, so the distinctiveness has to come from structure and motion, which is why each direction is built around one spatial idea instead of decorated sections.
- Changed while planning: A first had a card grid for workshops; replaced by the same ajar-door unit so the hall stays one idea. B first used a dense two-column broadsheet; replaced by one wide margin and generous rules so it reads as a CV page, not a newspaper.
