import React, { useRef, useState } from 'react'

// Components
import Node from './Node'
import Toolbar from './Toolbar'
// Functions
import {
    GetRowsCols, fillMatrix,
    pickRandomFreeNode
} from './functions/helperMethods'
import generateMaze from './functions/generateMaze'
import { breadthFirstSearch } from './functions/breadthFirstSearch'

function Grid() {

    const [rows, cols] = GetRowsCols();
    const matrix = fillMatrix(rows, cols, false);
    // Global State Variables
    const [startNode, setStartNode] = useState(undefined);
    const [goalNode, setGoalNode] = useState(undefined);
    const [isMouseDown, setIsMouseDown] = useState(false);
    // Graph Wall Representation
    const [isWall, setWall] = useState(matrix);
    const [carvedOrder, setCarvedOrder] = useState(undefined);
    // Graph Traversal Representation
    const [isTraversed, setTraversed] = useState(undefined);
    const [traversalOrder, setTraversalOrder] = useState([[]]);
    // Graph Shortest Path
    const [shortestPath, setShortestPath] = useState([[]]);

    const refCollection = useRef(matrix.map(rows => rows.map(nodes => React.createRef())));

    let grid = matrix.map((rows, i) => rows.map((_, j) => <Node
        // Globals
        key={[i, j]}
        coord={[i, j]}
        ref={refCollection.current[i][j]}
        startNode={startNode}
        goalNode={goalNode}
        isMouseDown={isMouseDown}
        // Individuals
        isWall={isWall?.[i]?.[j]}
        carvedOrder={carvedOrder}
        isTraversed={isTraversed?.[i][j]}
        traversalOrder={traversalOrder}
        // Shortest Path Coordinates
        shortestPath={shortestPath}
        // Function passed to child
        turnToWall={turnToWall}
    ></Node>))

    function turnToWall([i, j]) {
        let [...walls] = isWall;
        walls[i][j] = true;

        setWall(walls);
    }

    function createMazeAndAnimate() {
        const orderCarved = generateMaze(rows, cols, setWall, setStartNode,
            setGoalNode, setTraversed, setCarvedOrder);
        orderCarved.forEach(([y, x], i) => {
            setTimeout(() => {
                refCollection.current[y][x].current.className = 'node carved';
            }, i * 20);
        })
    }

    return (
        <>
            <Toolbar
                generateMaze={createMazeAndAnimate}
                pickRandomStart={() => pickRandomFreeNode(isWall, setStartNode)}
                pickRandomEnd={() => pickRandomFreeNode(isWall, setGoalNode)}
                startBfs={() => (!startNode || !goalNode ?
                    alert('Please Pick a Start and a Goal Node!!') :
                    breadthFirstSearch(isWall, startNode, goalNode, rows,
                        cols, setTraversed, setTraversalOrder, setShortestPath))}
            />
            <div
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
                className='grid'
            >
                {grid.map((row, i) => <div key={i} className='board-row'>{row}</div>)}
            </div>
        </>
    )
}

export default Grid
