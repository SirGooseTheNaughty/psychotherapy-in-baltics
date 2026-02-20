function useScheduleTable() {
    const wideBlock = document.querySelector('.uc-schedule-wide');
    const block = wideBlock || document.querySelector('.uc-schedule');
    const container = block.querySelector('.t-container');
    const breakpoints = [1200, 980, 640, 480];
    const getCurrentGridHeight = () => {
        for (let i = 0; i < breakpoints.length; i++) {
            if (document.body.clientWidth >= breakpoints[i]) {
                return gridSizes[i].v;
            }
        }
        return gridSizes[gridSizes.length - 1].v;
    }

    const setBlockHeight = () => {
        const gridHeight = getCurrentGridHeight();
        const contentHeight = container.clientHeight;
        const numCells = Math.ceil(contentHeight / gridHeight);
        block.style.setProperty('height', `${numCells * gridHeight}px`);
    };
    const contentResizeObserver = new ResizeObserver(setBlockHeight);
    contentResizeObserver.observe(container);

    const cells = document.querySelectorAll('.t431__tbody .t431__td:nth-child(2)');
    cells.forEach((cell) => {
        cell.innerHTML = cell.textContent.split(',').join('<br>');
    });

    if (wideBlock) {
        const profCells = document.querySelectorAll('.t431__tbody .t431__td:nth-child(4)');
        profCells.forEach((cell) => {
            cell.innerHTML = cell.textContent.split(',').join(',<br>');
        });
    }
}

window.addEventListener('load', () => setTimeout(useScheduleTable, 500));