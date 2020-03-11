(function (run) {
    document.addEventListener('DOMContentLoaded', run);
})(function () {
        const CellState = {
            WALL: 'W',
            EMPTY: 'E'
        };

        const level1map = getMapDescriptor('level-1-map');
        const level2map = getMapDescriptor('level-2-map');
        const level3map = getMapDescriptor('level-3-map');

        const gridTemplate = getTemplate('grid-template');
        const mainGrid = document.getElementById('main-grid');
        mainGrid.innerHTML = gridTemplate({rows: level1map});

        const allMaps = [level1map, level2map, level3map];
        //console.log(allMaps);

        let width = 10;
        let height = 10;
        const speed = 200;
        const SNAKE_CLASS_NAME = 'snake';
        const WALL_CLASS_NAME = 'wall';
        const FOOD_CLASS_NAME = 'food';
        let snakeLength = 5;
        let snakeFinishLength = 9;
        let xShift = 1;
        let yShift = 0;
        let x = 0;
        let y = 0;
        let hasFood = false;

        let snakeHead = {
            next: null,
            value: document.querySelector(`.grid ._${y}_${x}`),
            prev: null
        };

        document.body.onkeydown = function (e) {
            const coordsShift = getCoordsShift(e.code);
            xShift = coordsShift.x;
            yShift = coordsShift.y;
        };

        const timer = setInterval(updateView, speed);

        function updateView() {
            // Get next coords
            x = (x + xShift) < 0 ? width - 1 : (x + xShift) % width;
            y = (y + yShift) < 0 ? height - 1 : (y + yShift) % height;

            // Get next cell and move snake to this cell
            const nextCell = document.querySelector(`.grid ._${y}_${x}`);
            let newHead = {
                next: null,
                value: nextCell,
                prev: snakeHead
            };
            snakeHead.next = newHead;
            snakeHead = newHead;

            if (nextCell.classList.contains(SNAKE_CLASS_NAME)) {
                clearInterval(timer);
                alert('Game Over! Score: ' + snakeLength);
            }
            if (nextCell.classList.contains(WALL_CLASS_NAME)) {
                clearInterval(timer);
                alert('Game Over! Score: ' + snakeLength);
            }

            // add next-level map
            if (snakeLength === 9){
                clearInterval(timer);
                alert('You have reached the next level!');
                for (let i = 0; i < allMaps.length; i++){
                    mainGrid.innerHTML = gridTemplate({rows: allMaps[i]});
                }
            }

            // part responsible for food
            if (nextCell.classList.contains(FOOD_CLASS_NAME)) {
                nextCell.classList.remove(FOOD_CLASS_NAME);
                hasFood = false;
                snakeLength++;
            }

            // Here we highlight next cell
            nextCell.classList.add(SNAKE_CLASS_NAME);

            const snakeCells = document.querySelectorAll(`.grid .${SNAKE_CLASS_NAME}`);
            const currentSnakeLength = snakeCells.length;
            if (currentSnakeLength > snakeLength) {
                const tailCell = getTailCell(snakeHead);
                tailCell.value.classList.remove(SNAKE_CLASS_NAME);
                tailCell.next.prev = null;
            }

            while (!hasFood) {
                const fX = Math.round(Math.random() * 10 % width);
                const fY = Math.round(Math.random() * 10 % height);
                let cellForFood = document.querySelector(`.grid ._${fY}_${fX}`);
                if (!cellForFood.classList.contains(SNAKE_CLASS_NAME)) {
                    hasFood = true;
                    cellForFood.classList.add(FOOD_CLASS_NAME);
                }

            }
        }

        function getMapDescriptor(mapId) {
            const map = document.getElementById(mapId).innerHTML;
            const rows = map.trim().split('\n').map(row => row.trim());
            const mapDescriptor = [];
            for (let r = 0; r < rows.length; r++) {
                const cellTypes = rows[r];
                const rowDescriptor = [];
                for (let c = 0; c < cellTypes.length; c++) {
                    rowDescriptor.push({
                        r: r,
                        c: c,
                        wall: cellTypes[c] === CellState.WALL
                    });
                }
                mapDescriptor.push(rowDescriptor);
            }
            return mapDescriptor;
        }

        function getTemplate(templateId) {
            return Handlebars.compile(document.getElementById(templateId).innerHTML);
        }

        function getTailCell(snakeCell) {
            let cell = snakeHead;
            while (cell.prev) {
                cell = cell.prev;
            }
            return cell;
        }

        function getCoordsShift(keyCode) {
            switch (keyCode) {
                case 'ArrowLeft':
                    return {x: -1, y: 0};
                case 'ArrowRight':
                    return {x: 1, y: 0};
                case 'ArrowUp':
                    return {x: 0, y: -1};
                case 'ArrowDown':
                    return {x: 0, y: 1};
                default:
                    return {x: 0, y: 0};
            }
        }
    }
);

