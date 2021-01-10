const teams = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const rounds = [
    // round
    [
        // race group
        {
            teams: [0, 1, 2], // array of team in this race group
            win: 2 // index of item in array above that win racing
        },
        {
            teams: [3, 4],
            win: 1
        },
        {
            teams: [5],
            pass: 1 // no race, all teams pass as-is
        },
        {
            teams: [6, 7],
            win: 0
        }
    ],
    [
        {
            teams: [0],
            pass: true 
        },
        {
            teams: [1, 2, 3],
            win: 2
        }
    ],
    [
        {
            teams: [0, 1],
            win: 1
        }
    ]
];
