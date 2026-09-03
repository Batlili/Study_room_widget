/* ─────────────────────────
   MOLETTE
───────────────────────── */

class DurationWheel {

    constructor(element, min, max, value, callback) {

        this.element = element;
        this.min = min;
        this.max = max;
        this.value = value;
        this.callback = callback;
        this.lastY = null;

        this.render();
        this.bind();

    }


    render() {

        this.element.innerHTML = "";

        const previous = document.createElement("div");
        previous.className = "wheel-item previous";
        previous.textContent = this.getValue(-1);

        const current = document.createElement("div");
        current.className = "wheel-item current";
        current.textContent = this.value;

        const next = document.createElement("div");
        next.className = "wheel-item next";
        next.textContent = this.getValue(1);

        this.element.appendChild(previous);
        this.element.appendChild(current);
        this.element.appendChild(next);

    }


    getValue(offset) {

        let result = this.value + offset;

        if (result < this.min) {
            result = this.max;
        }

        if (result > this.max) {
            result = this.min;
        }

        return result;

    }


    change(direction) {

        let newValue = this.value + direction;

        if (newValue < this.min) {
            newValue = this.max;
        }

        if (newValue > this.max) {
            newValue = this.min;
        }

        this.value = newValue;

        this.render();
        this.callback(this.value);

    }


    bind() {

        this.element.addEventListener(
            "wheel",
            (event) => {

                event.preventDefault();

                if (event.deltaY > 0) {
                    this.change(1);
                }
                else {
                    this.change(-1);
                }

            },
            {
                passive: false
            }
        );


        this.element.addEventListener(
            "pointerdown",
            (event) => {

                this.lastY = event.clientY;

                this.element.setPointerCapture(
                    event.pointerId
                );

            }
        );


        this.element.addEventListener(
            "pointermove",
            (event) => {

                if (this.lastY === null) {
                    return;
                }

                const difference =
                    event.clientY - this.lastY;

                if (Math.abs(difference) >= 15) {

                    if (difference > 0) {
                        this.change(1);
                    }
                    else {
                        this.change(-1);
                    }

                    this.lastY = event.clientY;

                }

            }
        );


        this.element.addEventListener(
            "pointerup",
            () => {

                this.lastY = null;

            }
        );

    }

}