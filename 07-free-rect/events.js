
/**
 * Starts watching the mouse.  Calls updateRect when the user drags the mouse.
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {(number, number, number, number) => void} update
 */
export function watchMouseDragging(canvas, update) {
    let isDragging = false;
    const coordinates = [0, 0, 0, 0];
    canvas.addEventListener('mousedown', (event) => {
        isDragging = true;
        coordinates[0] = event.clientX;
        coordinates[1] = event.clientY;
    });
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
    canvas.addEventListener('mousemove', (event) => {
        if (isDragging) {
            coordinates[2] = event.clientX;
            coordinates[3] = event.clientY;
            update(...coordinates);
        }
    });
}