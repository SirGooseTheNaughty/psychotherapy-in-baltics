const meshData = {
    // colors: {
    //     tl: '#AFBED5',
    //     tr: '#93AEDA',
    //     bl: '#AFBED5',
    //     br: '#AFBED5'
    // },
    colors: {
        tl: '#91AED8',
        tr: '#9FB7DE',
        bl: '#AABEE1',
        br: '#AABEE1'
    },
    canvasId: 'mesh-canvas',
    dots: [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [0, 0],
        [0.9, 0.8]
    ],
    moving: [
        { index: 4, revert: false },
        // { index: 3, revert: true, coeff: 0.4, add: { vert: 0.5, hor: 0.5 } },
    ],
    target: [
        [-1, 0.5],
    ]
};