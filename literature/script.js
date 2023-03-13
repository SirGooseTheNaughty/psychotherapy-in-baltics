(function useLiterature() {
    const types = document.querySelectorAll('[class*="literature-type-"]');
    const courses = document.querySelectorAll('[class*="literature-course-"]');
    const blocks = document.querySelectorAll('[class*="uc-lit-"]');
    const active = {
        block: null,
        type: null,
        course: null,
    };

    const blockMap = [...blocks].reduce((acc, block) => {
        const className = [...block.classList].find((name) => name.includes('uc-lit-'));
        const [type, course] = className.split('uc-lit-')[1].split('-');
        if (!acc[type]) {
            acc[type] = {
                [course]: block,
            }
        } else {
            acc[type][course] = block;
        }
        return acc;
    }, {});

    const typeMap = [...types].reduce((acc, typeElem) => {
        const className = [...typeElem.classList].find((name) => name.includes('literature-type-'));
        const type = className.split('literature-type-')[1];
        acc[type] = typeElem;
        return acc;
    }, {});

    const courseMap = [...courses].reduce((acc, courseElem) => {
        const className = [...courseElem.classList].find((name) => name.includes('literature-course-'));
        const course = className.split('literature-course-')[1];
        acc[course] = courseElem;
        return acc;
    }, {});

    const hideAndRecolor = (type, course) => {
        if (active.block) {
            active.block.classList.remove('shown');
        }
        if (type && active.type !== type) {
            active.type && typeMap[active.type].classList.remove('active');
            typeMap[type].classList.add('active');
            active.type = type;
        }
        if (course && active.course !== course) {
            active.course && courseMap[active.course].classList.remove('active');
            courseMap[course].classList.add('active');
            active.course = course;
        }
    }

    const showBlock = (type, course) => {
        if (active.type === type && active.course === course) {
            return;
        }
        hideAndRecolor(type, course);
        const block = blockMap[type || active.type][course || active.course];
        block.classList.add('shown');
        active.block = block;
    }

    Object.entries(typeMap).forEach(([type, element]) => {
        element.addEventListener('click', () => showBlock(type, null));
    });
    Object.entries(courseMap).forEach(([course, element]) => {
        element.addEventListener('click', () => showBlock(null, course));
    });

    showBlock('books', '0');
})();