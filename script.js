// script.js

document.addEventListener("DOMContentLoaded", () => {
    const svgElement = SVG('#svg-element').size('1000px', '1000px');
    // const svgElement = draw.svg(document.getElementById('svg-element').outerHTML);
    const paths = svgElement.find('path');
    const rotationStep = 15; // degrees
    const fillDefault = '#808080';
    const fillOverlap = '#FF0000';
    let selectedPath = null;

    paths.forEach(path => {
        path.draggable();
        path.on('dragmove', checkOverlap);
        path.on('click', function () {
            selectedPath = this;
        });
    });

    function checkOverlap() {
        paths.forEach(p => p.fill(fillDefault)); // Reset fill color

        paths.forEach((path1, index1) => {
            paths.forEach((path2, index2) => {
                if (index1 !== index2 && areBoundingBoxesIntersecting(path1.bbox(), path2.bbox())) {
                    path1.fill(fillOverlap);
                    path2.fill(fillOverlap);
                }
            });
        });
    }

    function areBoundingBoxesIntersecting(bbox1, bbox2) {
        return !(bbox2.x > bbox1.x + bbox1.width ||
            bbox2.x + bbox2.width < bbox1.x ||
            bbox2.y > bbox1.y + bbox1.height ||
            bbox2.y + bbox2.height < bbox1.y);
    }

    document.addEventListener('keydown', (e) => {
        if (selectedPath) {
            if (e.key === 'q') {
                selectedPath.rotate(-rotationStep);
            } else if (e.key === 'e') {
                selectedPath.rotate(rotationStep);
            }
            checkOverlap();
        }
    });

    document.getElementById('calculate-button').addEventListener('click', () => {
        const bbox = svgElement.bbox();
        draw.rect(bbox.width, bbox.height).move(bbox.x, bbox.y).fill('none').stroke({ width: 2, color: '#000' });
        document.getElementById('bounding-box-info').innerText = `Bounding Box Area: ${bbox.width * bbox.height}`;
    });
});
