import { useState } from "react";

function Child({state, setState}) {
    const [state1, setState1] = useState(0);
    return (
        <div>
            <button onClick = {() => setState(0)} className="w-5/12 h-6xl">nothing</button>
            <button onClick = {() => setState(state + 1)} className="w-5/12 h-6xl">Increment</button>
            <button onClick = {() => setState1(state1 + 1)} className="w-5/12 h-6xl">Increment1</button>
            <p>State: {state1.val}</p>
            <p>State1: {state1}</p>
        </div>
    );
}
function Test() {
    console.log('rerender');
    const [state, setState] = useState(1000);
    return (<Child state = {state} setState = {setState}/>);
}

export default Test;