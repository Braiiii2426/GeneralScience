"use strict";


/* =========================
   DOM ELEMENTS
========================= */

const solidButton =
    document.getElementById("solidButton");

const liquidButton =
    document.getElementById("liquidButton");

const gasButton =
    document.getElementById("gasButton");

const simulationArea =
    document.getElementById("simulationArea");

const particlesContainer =
    document.getElementById("particles");

const stateTitle =
    document.getElementById("stateTitle");

const stateBadge =
    document.getElementById("stateBadge");

const motionLabel =
    document.getElementById("motionLabel");

const temperature =
    document.getElementById("temperature");

const temperatureValue =
    document.getElementById("temperatureValue");

const particleCount =
    document.getElementById("particleCount");

const particleCountValue =
    document.getElementById("particleCountValue");

const pauseButton =
    document.getElementById("pauseButton");

const resetButton =
    document.getElementById("resetButton");

const lessonTitle =
    document.getElementById("lessonTitle");

const lessonText =
    document.getElementById("lessonText");


/* =========================
   STATE
========================= */

let currentState =
    "solid";

let isPaused =
    false;

let particles = [];

let animationFrame;


/* =========================
   SOLID POSITION
========================= */

function createSolidPosition(
    index,
    total
) {

    const columns =
        Math.ceil(
            Math.sqrt(total)
        );

    const rows =
        Math.ceil(
            total / columns
        );

    const spacingX =
        80 / columns;

    const spacingY =
        78 / rows;

    const column =
        index % columns;

    const row =
        Math.floor(
            index / columns
        );

    const x =
        10 +
        column * spacingX +
        spacingX / 2;

    const y =
        10 +
        row * spacingY +
        spacingY / 2;


    return {

        baseX: x,

        baseY: y,

        x: x,

        y: y,

        vx: 0,

        vy: 0

    };

}


/* =========================
   LIQUID POSITION
========================= */

function createLiquidPosition() {

    return {

        x:
            10 +
            Math.random() * 80,

        y:
            15 +
            Math.random() * 70,

        vx:
            (Math.random() - 0.5) * 0.35,

        vy:
            (Math.random() - 0.5) * 0.35

    };

}


/* =========================
   GAS POSITION
========================= */

function createGasPosition() {

    return {

        x:
            3 +
            Math.random() * 94,

        y:
            3 +
            Math.random() * 94,

        vx:
            (Math.random() - 0.5) * 1.3,

        vy:
            (Math.random() - 0.5) * 1.3

    };

}


/* =========================
   CREATE PARTICLES
========================= */

function createParticles() {

    particlesContainer.innerHTML =
        "";

    particles = [];


    const total =
        Number(
            particleCount.value
        );


    for (
        let i = 0;
        i < total;
        i++
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.classList.add(
            "particle"
        );


        let position;


        /*
         * SOLID
         */

        if (
            currentState === "solid"
        ) {

            element.classList.add(
                "solid-particle"
            );

            position =
                createSolidPosition(
                    i,
                    total
                );

        }


        /*
         * LIQUID
         */

        else if (
            currentState === "liquid"
        ) {

            element.classList.add(
                "liquid-particle"
            );

            position =
                createLiquidPosition();

        }


        /*
         * GAS
         */

        else {

            element.classList.add(
                "gas-particle"
            );

            position =
                createGasPosition();

        }


        particles.push({

            element,

            ...position

        });


        particlesContainer.appendChild(
            element
        );

    }

}


/* =========================
   PARTICLE ANIMATION
========================= */

function updateParticles() {

    /*
     * TEMPERATURE
     */

    const temp =
        Number(
            temperature.value
        );


    /*
     * SOLID
     *
     * Particles vibrate around
     * fixed positions.
     */

    if (
        currentState === "solid"
    ) {

        const vibration =
            0.015 +
            temp * 0.001;


        const time =
            performance.now() /
            1000;


        particles.forEach(
            particle => {

                const phase =
                    particle.baseX *
                    0.7 +
                    particle.baseY *
                    0.5;


                particle.x =
                    particle.baseX +
                    Math.sin(
                        time * 8 +
                        phase
                    ) *
                    vibration *
                    10;


                particle.y =
                    particle.baseY +
                    Math.cos(
                        time * 7 +
                        phase
                    ) *
                    vibration *
                    10;


                particle.element.style.left =
                    particle.x + "%";


                particle.element.style.top =
                    particle.y + "%";

            }
        );

    }


    /*
     * LIQUID
     *
     * Particles move relatively
     * slowly and remain close.
     */

    else if (
        currentState === "liquid"
    ) {

        const speed =
            0.08 +
            temp * 0.0025;


        particles.forEach(
            particle => {

                particle.x +=
                    particle.vx *
                    speed *
                    2.5;

                particle.y +=
                    particle.vy *
                    speed *
                    2.5;


                if (
                    particle.x < 5
                ) {

                    particle.x = 5;

                    particle.vx =
                        Math.abs(
                            particle.vx
                        );

                }


                if (
                    particle.x > 95
                ) {

                    particle.x = 95;

                    particle.vx =
                        -Math.abs(
                            particle.vx
                        );

                }


                if (
                    particle.y < 5
                ) {

                    particle.y = 5;

                    particle.vy =
                        Math.abs(
                            particle.vy
                        );

                }


                if (
                    particle.y > 95
                ) {

                    particle.y = 95;

                    particle.vy =
                        -Math.abs(
                            particle.vy
                        );

                }


                particle.vx +=
                    (Math.random() - 0.5)
                    * 0.012;

                particle.vy +=
                    (Math.random() - 0.5)
                    * 0.012;


                const maxSpeed =
                    0.55 +
                    temp * 0.004;


                particle.vx =
                    Math.max(
                        -maxSpeed,
                        Math.min(
                            maxSpeed,
                            particle.vx
                        )
                    );


                particle.vy =
                    Math.max(
                        -maxSpeed,
                        Math.min(
                            maxSpeed,
                            particle.vy
                        )
                    );


                particle.element.style.left =
                    particle.x + "%";


                particle.element.style.top =
                    particle.y + "%";

            }
        );

    }


    /*
     * GAS
     *
     * Particles are far apart and
     * travel rapidly in random directions.
     */

    else {

        /*
         * Temperature controls gas speed.
         */

        const speedMultiplier =
            0.65 +
            temp * 0.012;


        particles.forEach(
            particle => {

                particle.x +=
                    particle.vx *
                    speedMultiplier;

                particle.y +=
                    particle.vy *
                    speedMultiplier;


                /*
                 * Bounce off left/right.
                 */

                if (
                    particle.x <= 1
                ) {

                    particle.x = 1;

                    particle.vx =
                        Math.abs(
                            particle.vx
                        );

                }


                if (
                    particle.x >= 99
                ) {

                    particle.x = 99;

                    particle.vx =
                        -Math.abs(
                            particle.vx
                        );

                }


                /*
                 * Bounce off top/bottom.
                 */

                if (
                    particle.y <= 1
                ) {

                    particle.y = 1;

                    particle.vy =
                        Math.abs(
                            particle.vy
                        );

                }


                if (
                    particle.y >= 99
                ) {

                    particle.y = 99;

                    particle.vy =
                        -Math.abs(
                            particle.vy
                        );

                }


                /*
                 * Slight random changes
                 * simulate irregular motion.
                 */

                particle.vx +=
                    (
                        Math.random() - 0.5
                    ) * 0.025;

                particle.vy +=
                    (
                        Math.random() - 0.5
                    ) * 0.025;


                /*
                 * Keep the gas fast but bounded.
                 */

                const maxSpeed =
                    1.8 +
                    temp * 0.015;


                particle.vx =
                    Math.max(
                        -maxSpeed,
                        Math.min(
                            maxSpeed,
                            particle.vx
                        )
                    );


                particle.vy =
                    Math.max(
                        -maxSpeed,
                        Math.min(
                            maxSpeed,
                            particle.vy
                        )
                    );


                particle.element.style.left =
                    particle.x + "%";


                particle.element.style.top =
                    particle.y + "%";

            }
        );

    }


    animationFrame =
        requestAnimationFrame(
            updateParticles
        );

}


/* =========================
   SET STATE
========================= */

function setState(
    newState
) {

    currentState =
        newState;


    /*
     * BUTTON STATES
     */

    solidButton.classList.toggle(
        "active",
        currentState === "solid"
    );

    liquidButton.classList.toggle(
        "active",
        currentState === "liquid"
    );

    gasButton.classList.toggle(
        "active",
        currentState === "gas"
    );


    /*
     * SIMULATION AREA
     */

    simulationArea.classList.remove(
        "solid-area",
        "liquid-area",
        "gas-area"
    );


    simulationArea.classList.add(
        `${currentState}-area`
    );


    /*
     * SOLID
     */

    if (
        currentState === "solid"
    ) {

        stateTitle.textContent =
            "Solid";

        stateBadge.textContent =
            "SOLID";

        stateBadge.className =
            "state-badge solid-badge";

        motionLabel.textContent =
            "Vibrating in fixed positions";


        lessonTitle.textContent =
            "Particles in a solid vibrate in place.";

        lessonText.textContent =
            "The particles are packed closely together and mainly vibrate around fixed positions. Higher temperature increases their vibration.";

    }


    /*
     * LIQUID
     */

    else if (
        currentState === "liquid"
    ) {

        stateTitle.textContent =
            "Liquid";

        stateBadge.textContent =
            "LIQUID";

        stateBadge.className =
            "state-badge liquid-badge";

        motionLabel.textContent =
            "Moving and sliding past each other";


        lessonTitle.textContent =
            "Particles in a liquid can move around.";

        lessonText.textContent =
            "Liquid particles remain close together, but they are able to change positions and slide past neighboring particles.";

    }


    /*
     * GAS
     */

    else {

        stateTitle.textContent =
            "Gas";

        stateBadge.textContent =
            "GAS";

        stateBadge.className =
            "state-badge gas-badge";

        motionLabel.textContent =
            "Rapidly moving in all directions";


        lessonTitle.textContent =
            "Particles in a gas move freely.";

        lessonText.textContent =
            "Gas particles are far apart and move rapidly in many directions. They spread throughout the available space.";

    }


    /*
     * REBUILD
     */

    cancelAnimationFrame(
        animationFrame
    );


    createParticles();


    animationFrame =
        requestAnimationFrame(
            updateParticles
        );

}


/* =========================
   TEMPERATURE
========================= */

temperature.addEventListener(
    "input",
    () => {

        temperatureValue.textContent =
            temperature.value + "%";

    }
);


/* =========================
   PARTICLE COUNT
========================= */

particleCount.addEventListener(
    "input",
    () => {

        particleCountValue.textContent =
            particleCount.value;


        createParticles();

    }
);


/* =========================
   BUTTONS
========================= */

solidButton.addEventListener(
    "click",
    () => {

        setState(
            "solid"
        );

    }
);


liquidButton.addEventListener(
    "click",
    () => {

        setState(
            "liquid"
        );

    }
);


gasButton.addEventListener(
    "click",
    () => {

        setState(
            "gas"
        );

    }
);


/* =========================
   PAUSE
========================= */

pauseButton.addEventListener(
    "click",
    () => {

        isPaused =
            !isPaused;


        if (
            isPaused
        ) {

            cancelAnimationFrame(
                animationFrame
            );

            pauseButton.textContent =
                "Resume";

        } else {

            pauseButton.textContent =
                "Pause";

            animationFrame =
                requestAnimationFrame(
                    updateParticles
                );

        }

    }
);


/* =========================
   RESET
========================= */

resetButton.addEventListener(
    "click",
    () => {

        temperature.value =
            30;

        temperatureValue.textContent =
            "30%";


        particleCount.value =
            50;

        particleCountValue.textContent =
            "50";


        isPaused =
            false;

        pauseButton.textContent =
            "Pause";


        setState(
            "solid"
        );

    }
);


/* =========================
   START
========================= */

createParticles();

animationFrame =
    requestAnimationFrame(
        updateParticles
    );
