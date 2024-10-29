const picker = {
    route: ["A", "D", "F", "H", "I"],
    destination: "I",
   
    radius: 1
};



const passengers = {
    passenger1: {
        route: ["A"],
        destination: "I",  
        radius: 1
    },
    passenger2: {
        route: ["C"],
        destination: "G",  
        radius: 1
    },
    passenger3: {
        route: ["D"],
        destination: "I",  
        radius: 1
    },
    passenger4: {
        route: ["F"],
        destination: "H",  
        radius: 1
    },
    passenger5: {
        route: ["E"],
        destination: "H",  
        radius: 1
    },
    passenger6: {
        route: ["B"],
        destination: "I",  
        radius: 1
    },
};
const graph = {
    A: ['D'],
    B: [],
    C: ['D'],
    D: ['F', 'H'],
    F: ['H', 'I'],
    H: ['I'],
    I: [],
    J: []
};

function findCompatiblePassengers(picker, passengers, graph) {
    const compatiblePassengers = [];

    for (let passenger in passengers) {
        const passengerRoute = passengers[passenger].route[0];
        const passengerDest = passengers[passenger].destination;

       
        if (
            picker.route.includes(passengerRoute) && 
            picker.route.includes(passengerDest) && 
            passengers[passenger].radius === picker.radius
        ) {
            let passengerDetails = `${passenger} route: ${passengerRoute}, destination: ${passengerDest}, radius: ${passengers[passenger].radius}`;
            compatiblePassengers.push(passengerDetails);
        }
    }

    return compatiblePassengers;
}

console.log(findCompatiblePassengers(picker, passengers, graph));
