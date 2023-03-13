(function useLiterature() {
    const courses = document.querySelectorAll('[class*="literature-course-"]');
    const blocks = document.querySelectorAll('[class*="uc-lit-"]');
    const active = {
        block: null,
        course: null,
    };
    const loadedBlocks = new Set([]);

    const blockMap = [...blocks].reduce((acc, block) => {
        const className = [...block.classList].find((name) => name.includes('uc-lit-'));
        const course = className.split('uc-lit-')[1];
        acc[course] = block;
        return acc;
    }, {});

    const courseMap = [...courses].reduce((acc, courseElem) => {
        const className = [...courseElem.classList].find((name) => name.includes('literature-course-'));
        const course = className.split('literature-course-')[1];
        acc[course] = courseElem;
        return acc;
    }, {});

    const loadBlockImages = (block) => {
        const images = block.querySelectorAll('img');
        images.forEach((img) => {
            if (!img.getAttribute('src')) {
                img.setAttribute('src', img.getAttribute('data-original'))
            }
        });
    };

    const hideAndRecolor = (course) => {
        if (active.block) {
            active.block.classList.remove('shown');
        }
        if (course && active.course !== course) {
            active.course && courseMap[active.course].classList.remove('active');
            courseMap[course].classList.add('active');
            active.course = course;
        }
    }

    const showBlock = (course) => {
        if (active.course === course) {
            return;
        }
        hideAndRecolor(course);
        const block = blockMap[course || active.course];
        if (!loadedBlocks.has(block.id)) {
            loadBlockImages(block);
            loadedBlocks.add(block.id);
        }
        block.classList.add('shown');
        active.block = block;
    }

    Object.entries(courseMap).forEach(([course, element]) => {
        element.addEventListener('click', () => showBlock(course));
    });

    showBlock('gestalt');
})();