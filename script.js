"use strict";


/* =========================
   DOM ELEMENTS
========================= */

const solidButton =
    document.getElementById("solidButton");

const liquidButton =
    document.getElementById("liquidButton");

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
   SIMULATION STATE
========================= */

let currentState = "solid";

let isPaused = false;

let particles = [];

let animationFrame;


/* =========================
   SOLID LAYOUT
========================= */

function createSolidParticlePosition(
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
        x,
        y,
        vx: 0,
        vy: 0
    };

}


/* =========================
   LIQUID POSITION
========================= */

function createLiquidParticlePosition() {

    return {

        x:
            5 +
            Math.random() * 90,

        y:
            5 +
            Math.random() * 90,

        vx:
            (Math.random() - 0.5) * 0.35,

        vy:
            (Math.random() - 0.5) * 0.35

    };

}


/* =========================
   CREATE PARTICLES
========================= */

function createParticles() {

    particlesContainer.innerHTML = "";

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


        if (
            currentState === "solid"
        ) {

            element.classList.add(
                "solid-particle"
            );

            const position =
                createSolidParticlePosition(
                    i,
                    total
                );

            particles.push({

                element,

                ...position

            });

        } else {

            element.classList.add(
                "liquid-particle"
            );

            const position =
                createLiquidParticlePosition();

            particles.push({

                element,

                ...position

            });

        }


        particlesContainer.appendChild(
            element
        );

    }

}


/* =========================
   UPDATE PARTICLES
========================= */

function updateParticles() {

    const temp =
        Number(
            temperature.value
        );


    /*
     * SOLID
     *
     * Particles remain near their
     * original positions.
     *
     * Higher temperature =
     * stronger vibration.
     */

    if (
        currentState === "solid"
    ) {

        const vibration =
            0.015 +
            temp * 0.0009;


        particles.forEach(
            particle => {

                const time =
                    performance.now() / 1000;


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
     * Particles freely travel around
     * the container.
     */

    else {

        const speed =
            0.08 +
            temp * 0.0028;


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


                /*
                 * Bounce off container walls.
                 */

                if (
                    particle.x < 3
                ) {

                    particle.x = 3;

                    particle.vx =
                        Math.abs(
                            particle.vx
                        );

                }


                if (
                    particle.x > 97
                ) {

                    particle.x = 97;

                    particle.vx =
                        -Math.abs(
                            particle.vx
                        );

                }


                if (
                    particle.y < 3
                ) {

                    particle.y = 3;

                    particle.vy =
                        Math.abs(
                            particle.vy
                        );

                }


                if (
                    particle.y > 97
                ) {

                    particle.y = 97;

                    particle.vy =
                        -Math.abs(
                            particle.vy
                        );

                }


                /*
                 * Slight random changes
                 * make liquid motion less
                 * perfectly straight.
                 */

                particle.vx +=
                    (Math.random() - 0.5)
                    * 0.012
                    * speed;


                particle.vy +=
                    (Math.random() - 0.5)
                    * 0.012
                    * speed;


                /*
                 * Prevent particles from
                 * accelerating forever.
                 */

                const maxSpeed =
                    0.6 +
                    temp * 0.005;


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
     * Continue animation.
     */

    animationFrame =
        requestAnimationFrame(
            updateParticles
        );

}


/* =========================
   CHANGE STATE
========================= */

function setState(
    newState
) {

    currentState =
        newState;


    /*
     * Change buttons.
     */

    solidButton.classList.toggle(
        "active",
        currentState === "solid"
    );

    liquidButton.classList.toggle(
        "active",
        currentState === "liquid"
    );


    /*
     * Change simulation appearance.
     */

    simulationArea.classList.toggle(
        "solid-area",
        currentState === "solid"
    );

    simulationArea.classList.toggle(
        "liquid-area",
        currentState === "liquid"
    );


    /*
     * Update text.
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
            "Increasing temperature makes the particles vibrate more strongly, but they remain around their fixed positions.";

    } else {

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
            "Liquid particles remain close together, but they can change positions and slide past neighboring particles.";

    }


    /*
     * Rebuild particles for the
     * new state.
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
   SOLID BUTTON
========================= */

solidButton.addEventListener(
    "click",
    () => {

        setState("solid");

    }
);


/* =========================
   LIQUID BUTTON
========================= */

liquidButton.addEventListener(
    "click",
    () => {

        setState("liquid");

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


        if (isPaused) {

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


        setState("solid");

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
