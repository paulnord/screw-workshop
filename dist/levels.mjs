// Original varied-shape assemblies; tested routes are examples, not claims about every timing or parking choice.
export const levelRecipes = [
  {
    "id": "v4-first-turn",
    "name": "First turn",
    "tip": "Move a screw into the spare, then reuse a mounting hole when the plate swings clear.",
    "rationale": "A short, fully visible lesson in fixed board holes versus holes in moving material.",
    "plates": [
      [
        [
          105,
          180
        ],
        [
          245,
          180
        ]
      ]
    ],
    "spareCount": 1,
    "hidden": [],
    "solution": [
      [
        0,
        [
          175,
          35
        ]
      ],
      [
        1,
        [
          105,
          180
        ]
      ]
    ]
  },
  {
    "id": "v4-choose-hinge",
    "name": "Choose the hinge",
    "tip": "Three screws hold this triangle. The last one left decides where it pivots.",
    "rationale": "Three anchors demonstrate that two pins fix a body, while the chosen final pin becomes the hinge.",
    "pieces": [
      {
        "outline": [
          [
            90,
            100
          ],
          [
            260,
            100
          ],
          [
            175,
            250
          ]
        ],
        "anchors": [
          [
            120,
            120
          ],
          [
            230,
            120
          ],
          [
            175,
            210
          ]
        ]
      }
    ],
    "hidden": [],
    "spareCount": 2,
    "solution": [
      [
        0,
        [
          105,
          35
        ]
      ],
      [
        1,
        [
          245,
          35
        ]
      ],
      [
        2,
        [
          120,
          120
        ]
      ]
    ]
  },
  {
    "name": "Hanging keystone",
    "pieces": [
      {
        "anchors": [
          [
            105,
            100
          ],
          [
            245,
            100
          ]
        ],
        "outline": [
          [
            87,
            83
          ],
          [
            263,
            83
          ],
          [
            263,
            117
          ],
          [
            87,
            117
          ]
        ],
        "components": [
          [
            [
              87,
              83
            ],
            [
              263,
              83
            ],
            [
              263,
              117
            ],
            [
              87,
              117
            ]
          ]
        ]
      },
      {
        "outline": [
          [
            95,
            145
          ],
          [
            255,
            145
          ],
          [
            175,
            285
          ]
        ],
        "components": [
          [
            [
              95,
              145
            ],
            [
              255,
              145
            ],
            [
              175,
              285
            ]
          ]
        ],
        "anchors": [
          [
            175,
            175
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "id": "v4-hanging-keystone",
    "solution": [
      [
        0,
        [
          105,
          35
        ]
      ],
      [
        1,
        [
          245,
          35
        ]
      ],
      [
        2,
        [
          105,
          100
        ]
      ]
    ],
    "rationale": "A single centered screw suspends a triangular support; removing it releases both the support and the loose beam resting on it.",
    "tip": "A single centered screw suspends a triangular support; removing it releases both the support and the loose beam resting on it.",
    "designEvidence": {
      "pivotChoices": [],
      "caughtAfterEachMove": [
        0,
        1,
        0
      ]
    }
  },
  {
    "name": "Catch and release",
    "plates": [
      [
        [
          100,
          120
        ],
        [
          250,
          120
        ]
      ],
      [
        [
          85,
          175
        ],
        [
          140,
          290
        ]
      ],
      [
        [
          265,
          175
        ],
        [
          210,
          290
        ]
      ]
    ],
    "hidden": [],
    "id": "v4-catch-and-release",
    "spareCount": 2,
    "solution": [
      [
        0,
        [
          105,
          35
        ]
      ],
      [
        4,
        [
          245,
          35
        ]
      ],
      [
        1,
        [
          265,
          175
        ]
      ],
      [
        3,
        [
          250,
          120
        ]
      ],
      [
        2,
        [
          140,
          290
        ]
      ],
      [
        5,
        [
          100,
          120
        ]
      ]
    ],
    "rationale": "The upper beam is caught between two angled supports; first tip one support to open a route rather than removing screws from the top blindly.",
    "tip": "The upper beam is caught between two angled supports; first tip one support to open a route rather than removing screws from the top blindly.",
    "designEvidence": {
      "alternative": {
        "sequence": [
          [
            3,
            [
              105,
              35
            ]
          ],
          [
            5,
            [
              245,
              35
            ]
          ],
          [
            2,
            [
              140,
              290
            ]
          ],
          [
            4,
            [
              85,
              175
            ]
          ],
          [
            0,
            [
              265,
              175
            ]
          ],
          [
            1,
            [
              100,
              120
            ]
          ]
        ],
        "complete": false,
        "unattachedRemaining": [
          {
            "p": 0,
            "clear": false,
            "attached": 0
          }
        ],
        "availableTargets": 2,
        "verifiedRecovery": [
          [
            0,
            [
              250,
              120
            ]
          ]
        ]
      },
      "caughtAfterEachMove": [
        0,
        0,
        1,
        1,
        1,
        0
      ]
    }
  },
  {
    "name": "Broken chevron",
    "plates": [
      [
        [
          65,
          140
        ],
        [
          135,
          210
        ]
      ],
      [
        [
          285,
          140
        ],
        [
          215,
          210
        ]
      ],
      [
        [
          105,
          290
        ],
        [
          245,
          290
        ]
      ]
    ],
    "hidden": [],
    "id": "v4-broken-chevron",
    "spareCount": 2,
    "solution": [
      [
        0,
        [
          105,
          35
        ]
      ],
      [
        2,
        [
          245,
          35
        ]
      ],
      [
        1,
        [
          65,
          140
        ]
      ],
      [
        3,
        [
          285,
          140
        ]
      ],
      [
        4,
        [
          135,
          210
        ]
      ],
      [
        5,
        [
          215,
          210
        ]
      ]
    ],
    "rationale": "Two inward-pointing arms rotate apart to release space over a lower beam; a readable balance puzzle.",
    "tip": "Two inward-pointing arms rotate apart to release space over a lower beam; a readable balance puzzle.",
    "designEvidence": {
      "alternative": {
        "sequence": [
          [
            4,
            [
              105,
              35
            ]
          ],
          [
            5,
            [
              245,
              35
            ]
          ],
          [
            1,
            [
              105,
              290
            ]
          ],
          [
            3,
            [
              135,
              210
            ]
          ],
          [
            0,
            [
              215,
              210
            ]
          ],
          [
            2,
            [
              65,
              140
            ]
          ]
        ],
        "complete": true,
        "unattachedRemaining": [],
        "availableTargets": 2,
        "verifiedRecovery": null
      },
      "caughtAfterEachMove": [
        0,
        0,
        1,
        2,
        0,
        0
      ]
    }
  },
  {
    "name": "Swing gate",
    "plates": [
      [
        [
          70,
          140
        ],
        [
          210,
          140
        ]
      ],
      [
        [
          280,
          140
        ],
        [
          280,
          280
        ]
      ],
      [
        [
          70,
          280
        ],
        [
          210,
          280
        ]
      ]
    ],
    "hidden": [],
    "id": "v4-swing-gate",
    "spareCount": 2,
    "solution": [
      [
        0,
        [
          105,
          35
        ]
      ],
      [
        1,
        [
          245,
          35
        ]
      ],
      [
        2,
        [
          70,
          140
        ]
      ],
      [
        3,
        [
          210,
          140
        ]
      ],
      [
        4,
        [
          280,
          140
        ]
      ],
      [
        5,
        [
          280,
          280
        ]
      ]
    ],
    "rationale": "Open the side gate before choosing where the lower bar can swing; the vertical plate changes the exit path.",
    "tip": "Open the side gate before choosing where the lower bar can swing; the vertical plate changes the exit path.",
    "designEvidence": {
      "alternative": {
        "sequence": [
          [
            3,
            [
              105,
              35
            ]
          ],
          [
            4,
            [
              245,
              35
            ]
          ],
          [
            5,
            [
              280,
              280
            ]
          ],
          [
            0,
            [
              70,
              280
            ]
          ],
          [
            1,
            [
              70,
              140
            ]
          ],
          [
            2,
            [
              210,
              140
            ]
          ]
        ],
        "complete": false,
        "unattachedRemaining": [
          {
            "p": 1,
            "clear": false,
            "attached": 0
          }
        ],
        "availableTargets": 1,
        "verifiedRecovery": [
          [
            0,
            [
              210,
              280
            ]
          ],
          [
            5,
            [
              70,
              280
            ]
          ]
        ]
      },
      "caughtAfterEachMove": [
        0,
        1,
        1,
        1,
        0,
        0
      ]
    }
  },
  {
    "name": "Three-point balance",
    "pieces": [
      {
        "outline": [
          [
            80,
            130
          ],
          [
            270,
            130
          ],
          [
            175,
            290
          ]
        ],
        "components": [
          [
            [
              80,
              130
            ],
            [
              270,
              130
            ],
            [
              175,
              290
            ]
          ]
        ],
        "anchors": [
          [
            115,
            155
          ],
          [
            235,
            155
          ],
          [
            175,
            245
          ]
        ]
      },
      {
        "anchors": [
          [
            105,
            340
          ],
          [
            245,
            340
          ]
        ],
        "outline": [
          [
            87,
            323
          ],
          [
            263,
            323
          ],
          [
            263,
            357
          ],
          [
            87,
            357
          ]
        ],
        "components": [
          [
            [
              87,
              323
            ],
            [
              263,
              323
            ],
            [
              263,
              357
            ],
            [
              87,
              357
            ]
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "id": "v4-three-point-balance",
    "solution": [
      [
        0,
        [
          105,
          35
        ]
      ],
      [
        1,
        [
          245,
          35
        ]
      ],
      [
        2,
        [
          115,
          155
        ]
      ],
      [
        3,
        [
          235,
          155
        ]
      ],
      [
        4,
        [
          175,
          245
        ]
      ]
    ],
    "rationale": "Three anchors make the last remaining pivot a real choice: the low anchor produces an inverted balance, while an upper anchor lets the triangle hang beside the shelf.",
    "tip": "Three anchors make the last remaining pivot a real choice: the low anchor produces an inverted balance, while an upper anchor lets the triangle hang beside the shelf.",
    "designEvidence": {
      "pivotChoices": [
        {
          "remaining": 0,
          "settles": true,
          "angle": 1.1512158775183359,
          "position": {
            "x": 113.69740747845272,
            "y": 221.27974889010324
          },
          "targets": [
            {
              "x": 235,
              "y": 155
            }
          ]
        },
        {
          "remaining": 1,
          "settles": true,
          "angle": -1.1512934007456144,
          "position": {
            "x": 236.30773073766895,
            "y": 221.27964770979267
          },
          "targets": [
            {
              "x": 115,
              "y": 155
            }
          ]
        },
        {
          "remaining": 2,
          "settles": true,
          "angle": -1.564269111382274,
          "position": {
            "x": 113.1917833045714,
            "y": 244.5965584097226
          },
          "targets": [
            {
              "x": 115,
              "y": 155
            },
            {
              "x": 235,
              "y": 155
            }
          ]
        }
      ],
      "caughtAfterEachMove": [
        0,
        0,
        1,
        0,
        0
      ]
    }
  },
  {
    "name": "Switchback",
    "plates": [
      [
        [
          70,
          130
        ],
        [
          210,
          180
        ]
      ],
      [
        [
          140,
          250
        ],
        [
          280,
          200
        ]
      ],
      [
        [
          70,
          320
        ],
        [
          210,
          370
        ]
      ]
    ],
    "hidden": [],
    "id": "v4-switchback",
    "spareCount": 2,
    "solution": [
      [
        0,
        [
          105,
          35
        ]
      ],
      [
        1,
        [
          245,
          35
        ]
      ],
      [
        3,
        [
          70,
          130
        ]
      ],
      [
        2,
        [
          210,
          180
        ]
      ],
      [
        4,
        [
          280,
          200
        ]
      ],
      [
        5,
        [
          140,
          250
        ]
      ]
    ],
    "rationale": "Opposing slopes deflect a loose beam sideways; park screws outside its predicted path.",
    "tip": "Opposing slopes deflect a loose beam sideways; park screws outside its predicted path.",
    "designEvidence": {
      "alternative": {
        "sequence": [
          [
            5,
            [
              105,
              35
            ]
          ],
          [
            4,
            [
              245,
              35
            ]
          ],
          [
            2,
            [
              70,
              320
            ]
          ],
          [
            3,
            [
              140,
              250
            ]
          ],
          [
            1,
            [
              280,
              200
            ]
          ],
          [
            0,
            [
              210,
              180
            ]
          ]
        ],
        "complete": false,
        "unattachedRemaining": [
          {
            "p": 0,
            "clear": false,
            "attached": 0
          }
        ],
        "availableTargets": 2,
        "verifiedRecovery": [
          [
            0,
            [
              70,
              130
            ]
          ],
          [
            2,
            [
              210,
              180
            ]
          ]
        ]
      },
      "caughtAfterEachMove": [
        0,
        1,
        0,
        1,
        0,
        0
      ]
    }
  },
  {
    "name": "The hook",
    "pieces": [
      {
        "outline": [
          [
            75,
            120
          ],
          [
            120,
            120
          ],
          [
            120,
            245
          ],
          [
            260,
            245
          ],
          [
            260,
            290
          ],
          [
            75,
            290
          ]
        ],
        "components": [
          [
            [
              75,
              120
            ],
            [
              120,
              120
            ],
            [
              120,
              245
            ],
            [
              75,
              245
            ]
          ],
          [
            [
              75,
              245
            ],
            [
              260,
              245
            ],
            [
              260,
              290
            ],
            [
              75,
              290
            ]
          ]
        ],
        "anchors": [
          [
            97.5,
            150
          ],
          [
            97.5,
            260
          ],
          [
            225,
            267.5
          ]
        ]
      },
      {
        "anchors": [
          [
            290,
            140
          ],
          [
            290,
            210
          ]
        ],
        "outline": [
          [
            307,
            122
          ],
          [
            307,
            228
          ],
          [
            273,
            228
          ],
          [
            273,
            122
          ]
        ],
        "components": [
          [
            [
              307,
              122
            ],
            [
              307,
              228
            ],
            [
              273,
              228
            ],
            [
              273,
              122
            ]
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "id": "v4-the-hook",
    "solution": [
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        0,
        [
          245,
          35
        ]
      ],
      [
        1,
        [
          97.5,
          150
        ]
      ],
      [
        3,
        [
          97.5,
          260
        ]
      ],
      [
        4,
        [
          290,
          140
        ]
      ]
    ],
    "rationale": "An asymmetric L can hook around the neighboring vertical gate; choose a pivot and clear a path for the long foot.",
    "tip": "An asymmetric L can hook around the neighboring vertical gate; choose a pivot and clear a path for the long foot.",
    "designEvidence": {
      "pivotChoices": [
        {
          "remaining": 0,
          "settles": true,
          "angle": 0.45059924610741064,
          "position": {
            "x": 98.49479683487193,
            "y": 243.7081594520188
          },
          "targets": [
            {
              "x": 225,
              "y": 267.5
            }
          ]
        },
        {
          "remaining": 1,
          "settles": true,
          "angle": 2.0565694098016074,
          "position": {
            "x": 101.08937952242324,
            "y": 309.05691356299883
          },
          "targets": [
            {
              "x": 97.5,
              "y": 150
            },
            {
              "x": 225,
              "y": 267.5
            }
          ]
        },
        {
          "remaining": 2,
          "settles": true,
          "angle": -1.934643941997184,
          "position": {
            "x": 224.15157270178355,
            "y": 359.6271965169532
          },
          "targets": [
            {
              "x": 97.5,
              "y": 150
            },
            {
              "x": 97.5,
              "y": 260
            }
          ]
        }
      ],
      "caughtAfterEachMove": [
        0,
        0,
        0,
        0,
        0
      ]
    }
  },
  {
    "name": "Open basket",
    "plates": [
      [
        [
          100,
          120
        ],
        [
          250,
          120
        ]
      ],
      [
        [
          85,
          175
        ],
        [
          140,
          290
        ]
      ],
      [
        [
          265,
          175
        ],
        [
          210,
          290
        ]
      ],
      [
        [
          105,
          365
        ],
        [
          245,
          365
        ]
      ]
    ],
    "hidden": [],
    "id": "v4-open-basket",
    "spareCount": 2,
    "solution": [
      [
        0,
        [
          105,
          35
        ]
      ],
      [
        4,
        [
          245,
          35
        ]
      ],
      [
        1,
        [
          265,
          175
        ]
      ],
      [
        3,
        [
          250,
          120
        ]
      ],
      [
        2,
        [
          140,
          290
        ]
      ],
      [
        5,
        [
          100,
          120
        ]
      ],
      [
        6,
        [
          85,
          175
        ]
      ],
      [
        7,
        [
          210,
          290
        ]
      ]
    ],
    "rationale": "An angled basket catches the upper beam, and a lower shelf creates a second support stage.",
    "tip": "An angled basket catches the upper beam, and a lower shelf creates a second support stage.",
    "designEvidence": {
      "alternative": {
        "sequence": [
          [
            6,
            [
              105,
              35
            ]
          ],
          [
            7,
            [
              245,
              35
            ]
          ],
          [
            3,
            [
              105,
              365
            ]
          ],
          [
            5,
            [
              140,
              290
            ]
          ],
          [
            2,
            [
              210,
              290
            ]
          ],
          [
            4,
            [
              85,
              175
            ]
          ],
          [
            0,
            [
              265,
              175
            ]
          ],
          [
            1,
            [
              100,
              120
            ]
          ]
        ],
        "complete": false,
        "unattachedRemaining": [
          {
            "p": 0,
            "clear": false,
            "attached": 0
          }
        ],
        "availableTargets": 2,
        "verifiedRecovery": [
          [
            0,
            [
              250,
              120
            ]
          ],
          [
            2,
            [
              265,
              175
            ]
          ]
        ]
      },
      "caughtAfterEachMove": [
        0,
        0,
        1,
        1,
        1,
        2,
        1,
        0
      ]
    }
  },
  {
    "name": "Crossbar gate",
    "plates": [
      [
        [
          70,
          120
        ],
        [
          70,
          260
        ]
      ],
      [
        [
          280,
          120
        ],
        [
          280,
          260
        ]
      ],
      [
        [
          140,
          190
        ],
        [
          210,
          190
        ]
      ],
      [
        [
          105,
          330
        ],
        [
          245,
          330
        ]
      ]
    ],
    "hidden": [],
    "id": "v4-crossbar-gate",
    "spareCount": 2,
    "solution": [
      [
        0,
        [
          105,
          35
        ]
      ],
      [
        2,
        [
          245,
          35
        ]
      ],
      [
        4,
        [
          70,
          120
        ]
      ],
      [
        1,
        [
          280,
          120
        ]
      ],
      [
        5,
        [
          140,
          190
        ]
      ],
      [
        3,
        [
          70,
          260
        ]
      ],
      [
        6,
        [
          210,
          190
        ]
      ],
      [
        7,
        [
          280,
          260
        ]
      ]
    ],
    "rationale": "Two hinged vertical gates flank a central bar; choose which gate to swing clear before letting the center drop.",
    "tip": "Two hinged vertical gates flank a central bar; choose which gate to swing clear before letting the center drop.",
    "designEvidence": {
      "alternative": {
        "sequence": [
          [
            6,
            [
              105,
              35
            ]
          ],
          [
            7,
            [
              245,
              35
            ]
          ],
          [
            1,
            [
              105,
              330
            ]
          ],
          [
            3,
            [
              70,
              260
            ]
          ],
          [
            4,
            [
              280,
              260
            ]
          ],
          [
            5,
            [
              140,
              190
            ]
          ],
          [
            0,
            [
              210,
              190
            ]
          ],
          [
            2,
            [
              245,
              330
            ]
          ]
        ],
        "complete": false,
        "unattachedRemaining": [
          {
            "p": 0,
            "clear": false,
            "attached": 0
          },
          {
            "p": 1,
            "clear": false,
            "attached": 0
          }
        ],
        "availableTargets": 0,
        "verifiedRecovery": null
      },
      "caughtAfterEachMove": [
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        0
      ]
    }
  },
  {
    "name": "Top-heavy lever",
    "pieces": [
      {
        "outline": [
          [
            65,
            130
          ],
          [
            285,
            130
          ],
          [
            285,
            175
          ],
          [
            198,
            175
          ],
          [
            198,
            295
          ],
          [
            152,
            295
          ],
          [
            152,
            175
          ],
          [
            65,
            175
          ]
        ],
        "components": [
          [
            [
              65,
              130
            ],
            [
              285,
              130
            ],
            [
              285,
              175
            ],
            [
              65,
              175
            ]
          ],
          [
            [
              152,
              175
            ],
            [
              198,
              175
            ],
            [
              198,
              295
            ],
            [
              152,
              295
            ]
          ]
        ],
        "anchors": [
          [
            95,
            152.5
          ],
          [
            255,
            152.5
          ],
          [
            175,
            260
          ]
        ]
      },
      {
        "anchors": [
          [
            65,
            230
          ],
          [
            115,
            280
          ]
        ],
        "outline": [
          [
            64.29289321881345,
            205.25126265847084
          ],
          [
            139.74873734152916,
            280.70710678118655
          ],
          [
            115.70710678118654,
            304.74873734152914
          ],
          [
            40.251262658470836,
            229.29289321881348
          ]
        ],
        "components": [
          [
            [
              64.29289321881345,
              205.25126265847084
            ],
            [
              139.74873734152916,
              280.70710678118655
            ],
            [
              115.70710678118654,
              304.74873734152914
            ],
            [
              40.251262658470836,
              229.29289321881348
            ]
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "id": "v4-top-heavy-lever",
    "solution": [
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        0,
        [
          245,
          35
        ]
      ],
      [
        1,
        [
          95,
          152.5
        ]
      ],
      [
        3,
        [
          255,
          152.5
        ]
      ],
      [
        4,
        [
          65,
          230
        ]
      ]
    ],
    "rationale": "The wide T crossbar changes the center of mass and sweeps a much larger arc than its narrow stem; a diagonal prop can catch one arm.",
    "tip": "The wide T crossbar changes the center of mass and sweeps a much larger arc than its narrow stem; a diagonal prop can catch one arm.",
    "designEvidence": {
      "pivotChoices": [
        {
          "remaining": 0,
          "settles": true,
          "angle": 0.09854656536503051,
          "position": {
            "x": 171.7585165245078,
            "y": 189.23168067856375
          },
          "targets": []
        },
        {
          "remaining": 1,
          "settles": true,
          "angle": -0.22180687507862518,
          "position": {
            "x": 183.3400706896019,
            "y": 198.39026015445657
          },
          "targets": [
            {
              "x": 95,
              "y": 152.5
            }
          ]
        },
        {
          "remaining": 2,
          "settles": true,
          "angle": -0.3010719373622737,
          "position": {
            "x": 151.7216968349403,
            "y": 185.03231129577713
          },
          "targets": []
        }
      ],
      "caughtAfterEachMove": [
        0,
        0,
        0,
        0,
        0
      ]
    }
  }
];
