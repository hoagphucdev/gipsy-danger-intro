// Report text for each tour part (keyed by PARTS id in config/tour.js).
// Lore from Pacific Rim (2013) and the Pacific Rim Wiki — fictional.
// In `lead` and `body`, **double asterisks** mark a highlighted figure or term.
// Optional: `timeline` ([when, what] rows) for history pages.

export const PART_CONTENT = {
  head: {
    title: 'Conn-Pod',
    subtitle: 'Head · cockpit',
    lead: 'A detachable cockpit that seats **two pilots** side by side, joined to the machine through the neural Drift.',
    figures: [
      { value: '2', label: 'Pilots in the Drift' },
      { value: '360°', label: 'Pod rotation on docking' },
      { value: 'Eject', label: 'Doubles as escape pod' },
    ],
    body: [
      'The head is not fixed to the hull. The Conn-Pod drops onto the torso and **rotates 360°** as it locks into place, which is why the shoulder armour rises into large flaps: they shield the back of the pod and the exposed neck joint.',
      'Inside, the load of moving **1,980 tonnes** is too much for one mind. The Pons system links two pilots in the **Drift** — each brain hemisphere drives one half of the Jaeger, and both pilots share memories while connected.',
      'The amber visor is armoured glass over the pilots’ station. During a fight the pod is the last part to be abandoned: if the hull is lost, it separates and floats as a sealed lifeboat.',
    ],
    specs: [
      ['Crew', '2 pilots'],
      ['Interface', 'Pons neural bridge'],
      ['Visor', 'Amber, armoured'],
      ['Egress', 'Detachable pod'],
    ],
  },

  reactor: {
    title: 'Nuclear Vortex Turbine',
    subtitle: 'Chest · power core',
    lead: 'An **Arc-9 analog nuclear reactor** in the centre of the chest spins the turbine that powers every actuator.',
    figures: [
      { value: 'Arc-9', label: 'Analog reactor' },
      { value: 'EMP', label: 'Immune — no digital core' },
      { value: '08FS', label: 'Oceanic cooling vents' },
    ],
    body: [
      'Being **analog** is Gipsy Danger’s quiet advantage: when an EMP knocks out the digital Mark-5 Jaegers, the Mark-3 keeps running. The orange glow of the turbine is the machine’s signature.',
      'The **08FS oceanic cooling** vents pull seawater through the coolant circuit to hold the core at temperature. As a last resort the turbine can be overloaded and vented as a **point-blank heat blast**, and the coolant itself can be released to freeze an opponent.',
      'The turbine is the heaviest single component in the torso and sits on the centre line, low enough to keep the machine’s centre of gravity above the hips. Its housing ring is visible on the chest plate as the spinning vortex.',
    ],
    specs: [
      ['Reactor', 'Arc-9, analog'],
      ['Output', 'Full-body actuation'],
      ['Cooling', '08FS oceanic vents'],
      ['Status', 'Online'],
    ],
  },

  shoulders: {
    title: 'Shoulder Rotators',
    subtitle: 'Shoulders · armour',
    lead: 'The heaviest moving assemblies above the waist: layered plates over the joints that swing each arm.',
    figures: [
      { value: '98BD', label: 'Hyper-torque drives' },
      { value: '4 · 5', label: 'Hull markings' },
      { value: '2', label: 'Neck-guard flaps' },
    ],
    body: [
      'Each shoulder carries a rotator driven by **98BD hyper-torque drives**, which give the Jaeger’s muscle strands the extra torque needed to throw a punch with the whole body behind it.',
      'The rear of the shoulder armour rises into **neck-guard flaps** that close around the Conn-Pod joint — the most vulnerable point of a detachable-head design. The painted hull numbers are part of the original 2017 livery.',
      'Because the arms hang from these joints, every weapon load — plasmacaster or chain sword — passes through the shoulder rotators before it reaches the hull. They are the first assemblies inspected after a fight.',
    ],
    specs: [
      ['Drive', '98BD hyper-torque'],
      ['Armour', 'Layered alloy plate'],
      ['Guard', 'Conn-Pod neck flaps'],
      ['Markings', 'Hull 4 / 5'],
    ],
  },

  arms: {
    title: 'I-19 Plasmacaster',
    subtitle: 'Arms · weapons',
    lead: 'The forearms reconfigure between fists, **I-19 plasma cannons** and the **GD-6 chain sword**.',
    figures: [
      { value: 'I-19', label: 'Plasmacaster' },
      { value: 'GD-6', label: 'Chain sword' },
      { value: 'Elbow', label: 'Rocket-assisted punch' },
    ],
    body: [
      'The **I-19 Plasmacaster** is a particle-dispersal cannon that folds out of the forearm. Its burst both wounds and cauterises, keeping toxic Kaiju Blue from spilling into the harbour.',
      'For close quarters the **GD-6 chain sword** unfolds from the wrist in segments. An **elbow rocket** fires along the upper arm to add thrust to a punch. Use the loadout variants of the model to compare the configurations.',
      'Each forearm is a self-contained weapon bay: the variants in the model (hand, fist, sword, plasma) are the configurations the arm can take. The hands themselves are articulated enough to grab and hold a Kaiju.',
    ],
    specs: [
      ['Ranged', 'I-19 Plasmacaster'],
      ['Melee', 'GD-6 Chain Sword'],
      ['Boost', 'Elbow rocket'],
      ['Variants', 'Hand · Fist · Sword · Plasma'],
    ],
  },

  legs: {
    title: 'Hydraulic Legs',
    subtitle: 'Legs · locomotion',
    lead: 'Hip, thigh and calf actuators carry **1,980 tonnes** through open sea and city streets.',
    figures: [
      { value: '1,980 t', label: 'Operating weight' },
      { value: '10KT', label: 'Gyro-stabilisers' },
      { value: '7 · 8 · 6', label: 'Speed · strength · armour' },
    ],
    body: [
      'Walking is where the Drift matters most: each pilot controls one leg, and every step has to be agreed by two minds at once. **10KT gyro-stabilisers** smooth the bipedal motion and keep the machine upright against surf and impact.',
      'In the PPDC ratings Gipsy Danger scores **speed 7, strength 8 and armour 6** — a balanced Mark-3 built for coastal defence rather than raw power.',
      'The hip joint carries the whole upper body and turns with the waist for punches, while the calves hold the long-stroke actuators that let the Jaeger wade through surf up to its thighs.',
    ],
    specs: [
      ['Weight', '1,980 t'],
      ['Stability', '10KT gyro-stabilisers'],
      ['Ratings', 'Speed 7 · Strength 8 · Armour 6'],
      ['Drive', 'Hydraulic actuators'],
    ],
  },

  feet: {
    title: 'Load-bearing Feet',
    subtitle: 'Feet · stance',
    lead: 'Wide, armoured feet spread the load so the Jaeger can stand in harbour silt without sinking.',
    figures: [
      { value: '79.25 m', label: 'Standing height' },
      { value: '2017', label: 'Launched, July 10' },
      { value: 'Anchorage', label: 'Home Shatterdome' },
    ],
    body: [
      'Everything above rests here: a **79.25-metre** machine balanced on two armoured soles. The wide track keeps ground pressure low enough to wade through coastal shallows during a deployment.',
      'Gipsy Danger was launched on **10 July 2017** from the **Anchorage Shatterdome** to guard the Alaskan coast, and was rebuilt after heavy damage to return to service in 2025.',
      'The soles are the parts that take the most damage from ordinary work: every step on a harbour floor or a city street grinds the armour, so they are re-plated at almost every repair cycle.',
    ],
    specs: [
      ['Height', '79.25 m (260 ft)'],
      ['Launch', '10 July 2017'],
      ['Base', 'Anchorage Shatterdome'],
      ['Class', 'Mark-3, USA'],
    ],
  },
  record: {
    title: 'Service Record',
    subtitle: 'Whole machine · history',
    lead: 'A Mark-3 built in the United States, in service from **2017** until its final mission in **2025**.',
    figures: [
      { value: '8 yrs', label: 'In service' },
      { value: '3', label: 'Pilots over its life' },
      { value: '1', label: 'Full rebuild' },
    ],
    body: [
      'Gipsy Danger was one of the most successful early Jaegers, defending the Alaskan coast from the **Anchorage Shatterdome**. It was nearly lost in **2020**, then rebuilt and brought back for the last campaign of the war.',
    ],
    timeline: [
      ['2017', 'Launched on 10 July from the Anchorage Shatterdome; pilots Yancy and Raleigh Becket.'],
      ['2020', 'Battle of Anchorage against Knifehead: Yancy is killed, the Jaeger is heavily damaged and walked ashore by Raleigh alone.'],
      ['2020–25', 'Rebuilt under the Mark III restoration programme; upgraded with the GD-6 chain sword.'],
      ['2025', 'Battle of Hong Kong with Raleigh Becket and Mako Mori: defeats Leatherback and Otachi.'],
      ['2025', 'Final mission at the Breach: the reactor is overloaded to seal it, and the pilots eject in their pods.'],
    ],
    specs: [
      ['Class', 'Mark-3, USA'],
      ['Height', '79.25 m (260 ft)'],
      ['Weight', '1,980 t'],
      ['Power', 'Arc-9 nuclear vortex turbine'],
      ['Ratings', 'Speed 7 · Strength 8 · Armour 6'],
      ['Weapons', 'I-19 Plasmacaster · GD-6 Chain Sword · Elbow rocket'],
      ['Pilots', 'Y. & R. Becket (2017–20) · R. Becket & M. Mori (2025)'],
      ['Home base', 'Anchorage, later Hong Kong Shatterdome'],
    ],
  },
}

export const SOURCES = 'Sources: Pacific Rim (2013); Pacific Rim Wiki. Fictional lore.'
