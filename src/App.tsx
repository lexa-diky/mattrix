import React, {useState} from 'react';
import './App.css';
import {
    Box, Button,
    ButtonGroup,
    Input,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableFooter, TableHead,
    TableRow, TextField, Typography
} from "@material-ui/core";


function InputTable(props: { name: string, onUpdated: (arr: Array<Array<number>>) => void }) {
    const [table, update] = useState([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ])

    function incTable() {
        table.forEach(row => {
            row.push(0)
        })
        table.push(Array(table[0].length).fill(0))
        props.onUpdated(table)
        update([...table])
    }

    function decTable() {
        if (table.length === 1) {
            alert("Размер матрицы слишком мал")
            return
        }
        table.forEach(row => {
            row.pop()
        })
        table.pop()
        props.onUpdated(table)
        update([...table])
    }

    function updateMatrix(i: number, j: number, event: any) {
        let val = parseInt(event.target.value)
        if (isNaN(val)) {
            val = 0
        }
        table[i][j] = val
        props.onUpdated(table)
        update([...table])
    }

    return <Paper style={{margin: 16}} elevation={16}>
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <Typography style={{margin: 8}} variant="h5">{props.name}</Typography>
                </TableHead>
                <TableBody>
                    {
                        table.map((row, i) =>
                            <TableRow>
                                {
                                    row.map((cell, j) =>
                                        <TableCell>
                                            <TextField size="small" onChange={e => updateMatrix(i, j, e)} value={cell}/>
                                        </TableCell>
                                    )
                                }
                            </TableRow>
                        )
                    }
                </TableBody>
                <TableFooter>
                    <ButtonGroup style={{margin: 8}} color="primary" aria-label="outlined primary button group">
                        <Button onClick={() => incTable()}>+</Button>
                        <Button onClick={() => decTable()}>-</Button>
                    </ButtonGroup>
                </TableFooter>
            </Table>
        </TableContainer>
    </Paper>
}

function VectorRow(props: { onUpdated: (arr: Array<number>) => void }) {

    const [vector, update] = useState([0, 0, 0])

    function incVector() {
        vector.push(0)
        props.onUpdated(vector)
        update([...vector])
    }

    function decVector() {
        vector.pop()
        props.onUpdated(vector)
        update([...vector])
    }

    function updateVector(at: number, event: any) {
        let val = parseInt(event.target.value)
        if (isNaN(val)) {
            val = 0
        }
        vector[at] = val
        props.onUpdated(vector)
        update([...vector])
    }

    return <Paper style={{margin: 16}} elevation={16}>
        <TableContainer>
            <Table>
                <TableHead>
                    <Typography style={{margin: 8}} variant="h5">
                        Вектор X
                    </Typography>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {
                            vector.map((x, at) => <TableCell>
                                <TextField size="small" onChange={(e) => updateVector(at, e)} value={x}/>
                            </TableCell>)
                        }
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <ButtonGroup style={{margin: 8}} color="primary" aria-label="outlined primary button group">
                        <Button onClick={() => incVector()}>+</Button>
                        <Button onClick={() => decVector()}>-</Button>
                    </ButtonGroup>
                </TableFooter>
            </Table>
        </TableContainer>
    </Paper>
}

function OutputWindow(props: { net1: Array<number>, out1: Array<number>, net2: Array<number>, out2: Array<number> }) {
    const data = [
        ['NET1', ...props.net1],
        ['OUT1', ...props.out1],
        ['NET2', ...props.net2],
        ['OUT2', ...props.out2]
    ]
    return <Paper style={{margin: 16}} elevation={16}>
        <TableContainer>
            <Table>
                <TableHead>
                    <Typography style={{margin: 8}} variant="h5">Результат</Typography>
                </TableHead>
                <TableBody>
                    {
                        data.map((row) => <TableRow>
                            {
                                row.map((cell, i) => <TableCell style={{fontWeight: i === 0 ? "bold" : "normal"}}>
                                    {cell}
                                </TableCell>)
                            }
                        </TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
}

function App() {

    const [state, update] = useState({
        w: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        v: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        x: [0, 0, 0]
    })

    function onTableUpdated(name: string, table: Array<Array<number>>) {
        if (name === "W") {
            state.w = table
        } else {
            state.v = table
        }
        update({
            w: state.w,
            v: state.v,
            x: state.x
        })
    }

    function onVectorUpdated(vector: Array<number>) {
        update({
            w: state.w,
            v: state.v,
            x: vector
        })
    }


    function renderResult() {
        try {
            const net1 = Calculator.multiply(state.x, state.w)
            const out1 = Calculator.fVec(net1)
            const net2 = Calculator.multiply(out1, state.v)
            const out2 = Calculator.fVec(net2)

            return <OutputWindow out1={out1} out2={out2} net1={net1} net2={net2}/>
        } catch {
            return <Typography style={{margin: 16}} color="error" variant="h5">Ошибка</Typography>
        }

    }

    return (
        <div className="App">
            <Box display="flex">
                <VectorRow onUpdated={(arr) => onVectorUpdated(arr)}/>
            </Box>
            <Box display="flex" flexDirection="row">
                <InputTable name="Матрица W" onUpdated={(t) => onTableUpdated("W", t)}/>
                <InputTable name="Матрица V" onUpdated={(t) => onTableUpdated("V", t)}/>
            </Box>
            <Box display="flex">
                {
                    renderResult()
                }
            </Box>
        </div>
    );
}

class Calculator {
    static f(v: number) {
        return (1 / (1 + Math.exp(-v)))
    }

    static fVec(vector: Array<number>) {
        return vector.map(x => Calculator.f(x))
    }

    static multiply(vector: Array<number>, matrix: Array<Array<number>>) {
        const result: Array<number> = Array(matrix.length).fill(0)
        for (let j = 0; j < matrix[0].length; j++) {
            for (let i = 0; i < vector.length; i++) {
                result[j] += vector[j] * matrix[i][j]
            }
        }
        return result
    }
}

export default App;
