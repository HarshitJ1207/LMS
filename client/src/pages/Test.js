import { useState } from "react";

function Child({state, setState}) {
    const [state1, setState1] = useState(state);
    return (
        <div>
            <button onClick = {() => setState(state + 1)} className="w-5/12 h-6xl">Increment</button>
            <button onClick = {() => setState1(state1 + 1)} className="w-5/12 h-6xl">Increment1</button>
            <p>State: {state}</p>
            <p>State1: {state1}</p>
        </div>
    );
}
function Test() {
    const [state, setState] = useState(0);
    return (<Child state = {state} setState = {setState}/>);
}

export default Test;