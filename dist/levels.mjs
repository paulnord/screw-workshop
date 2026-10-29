// Original assemblies; verified physical routes, not all possible timing or parking strategies.
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
    "id": "v7-tilted-ladder",
    "name": "Tilted ladder",
    "packIndex": 0,
    "tip": "The sloping ladder rests against a hanging keeper. Choose which hinge frees the next parking hole.",
    "rationale": "The sloping ladder rests against a hanging keeper. Choose which hinge frees the next parking hole.",
    "pieces": [
      {
        "bar": [
          [
            80,
            130
          ],
          [
            260,
            220
          ]
        ]
      },
      {
        "outline": [
          [
            140,
            270
          ],
          [
            195,
            270
          ],
          [
            195,
            355
          ],
          [
            140,
            355
          ]
        ],
        "anchors": [
          [
            167,
            295
          ]
        ]
      }
    ],
    "spareCount": 1,
    "hidden": [],
    "solution": [
      [
        2,
        [
          175,
          35
        ]
      ],
      [
        1,
        [
          167,
          295
        ]
      ],
      [
        0,
        [
          260,
          220
        ]
      ]
    ]
  },
  {
    "id": "v7-broad-sail",
    "name": "Broad sail",
    "packIndex": 0,
    "tip": "A broad sail drops onto a short rail. Open the rail before the last sail pin or plan where the sail will rest.",
    "rationale": "A broad sail drops onto a short rail. Open the rail before the last sail pin or plan where the sail will rest.",
    "pieces": [
      {
        "outline": [
          [
            55,
            80
          ],
          [
            295,
            80
          ],
          [
            175,
            240
          ]
        ],
        "anchors": [
          [
            95,
            105
          ],
          [
            255,
            105
          ],
          [
            175,
            190
          ]
        ]
      },
      {
        "bar": [
          [
            125,
            310
          ],
          [
            225,
            310
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
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
        2,
        [
          125,
          310
        ]
      ],
      [
        0,
        [
          225,
          310
        ]
      ],
      [
        1,
        [
          95,
          105
        ]
      ]
    ]
  },
  {
    "id": "v7-twin-doors",
    "name": "Twin doors",
    "packIndex": 0,
    "tip": "Open one door before borrowing its empty mounting hole for the other.",
    "rationale": "Open one door before borrowing its empty mounting hole for the other.",
    "pieces": [
      {
        "outline": [
          [
            55,
            110
          ],
          [
            135,
            110
          ],
          [
            135,
            250
          ],
          [
            55,
            250
          ]
        ],
        "anchors": [
          [
            80,
            135
          ],
          [
            110,
            225
          ]
        ]
      },
      {
        "outline": [
          [
            215,
            110
          ],
          [
            295,
            110
          ],
          [
            295,
            250
          ],
          [
            215,
            250
          ]
        ],
        "anchors": [
          [
            240,
            135
          ],
          [
            270,
            225
          ]
        ]
      }
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
          80,
          135
        ]
      ],
      [
        2,
        [
          110,
          225
        ]
      ],
      [
        3,
        [
          240,
          135
        ]
      ]
    ]
  },
  {
    "id": "v7-small-step",
    "name": "Small step",
    "packIndex": 0,
    "tip": "A short lower bar catches the long one. Clear the step when the upper bar is loose.",
    "rationale": "A short lower bar catches the long one. Clear the step when the upper bar is loose.",
    "pieces": [
      {
        "bar": [
          [
            65,
            135
          ],
          [
            285,
            135
          ]
        ]
      },
      {
        "bar": [
          [
            135,
            260
          ],
          [
            235,
            260
          ]
        ]
      }
    ],
    "spareCount": 1,
    "hidden": [],
    "solution": [
      [
        2,
        [
          175,
          35
        ]
      ],
      [
        0,
        [
          135,
          260
        ]
      ],
      [
        1,
        [
          65,
          135
        ]
      ],
      [
        3,
        [
          285,
          135
        ]
      ]
    ]
  },
  {
    "id": "v7-diamond-drop",
    "name": "Diamond drop",
    "packIndex": 0,
    "tip": "Release the narrow support and then choose which way the diamond turns.",
    "rationale": "Release the narrow support and then choose which way the diamond turns.",
    "pieces": [
      {
        "outline": [
          [
            175,
            85
          ],
          [
            255,
            160
          ],
          [
            175,
            235
          ],
          [
            95,
            160
          ]
        ],
        "anchors": [
          [
            175,
            115
          ],
          [
            175,
            200
          ]
        ]
      },
      {
        "bar": [
          [
            90,
            285
          ],
          [
            260,
            285
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        3,
        [
          245,
          35
        ]
      ],
      [
        0,
        [
          90,
          285
        ]
      ],
      [
        1,
        [
          175,
          115
        ]
      ]
    ]
  },
  {
    "id": "v7-three-rungs",
    "name": "Three rungs",
    "packIndex": 0,
    "tip": "Clear rungs from the bottom or let them rest on one another while you plan.",
    "rationale": "Clear rungs from the bottom or let them rest on one another while you plan.",
    "pieces": [
      {
        "bar": [
          [
            90,
            110
          ],
          [
            250,
            110
          ]
        ]
      },
      {
        "bar": [
          [
            70,
            220
          ],
          [
            270,
            220
          ]
        ]
      },
      {
        "bar": [
          [
            110,
            330
          ],
          [
            230,
            330
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
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
        2,
        [
          110,
          330
        ]
      ],
      [
        3,
        [
          70,
          220
        ]
      ],
      [
        0,
        [
          270,
          220
        ]
      ],
      [
        1,
        [
          90,
          110
        ]
      ]
    ]
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
    "id": "v7-elbow-room",
    "name": "Elbow room",
    "packIndex": 1,
    "tip": "An elbow sweeps a wider arc than a bar. Leave space beside its foot.",
    "rationale": "An elbow sweeps a wider arc than a bar. Leave space beside its foot.",
    "pieces": [
      {
        "outline": [
          [
            65,
            95
          ],
          [
            105,
            95
          ],
          [
            105,
            215
          ],
          [
            225,
            215
          ],
          [
            225,
            255
          ],
          [
            65,
            255
          ]
        ],
        "components": [
          [
            [
              65,
              95
            ],
            [
              105,
              95
            ],
            [
              105,
              215
            ],
            [
              65,
              215
            ]
          ],
          [
            [
              65,
              215
            ],
            [
              225,
              215
            ],
            [
              225,
              255
            ],
            [
              65,
              255
            ]
          ]
        ],
        "anchors": [
          [
            85,
            120
          ],
          [
            195,
            235
          ]
        ]
      },
      {
        "bar": [
          [
            255,
            135
          ],
          [
            285,
            265
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        3,
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
          195,
          235
        ]
      ],
      [
        0,
        [
          255,
          135
        ]
      ]
    ]
  },
  {
    "id": "v7-kite-and-rail",
    "name": "Kite and rail",
    "packIndex": 1,
    "tip": "The kite can rotate onto the rail. Decide whether to release the rail first.",
    "rationale": "The kite can rotate onto the rail. Decide whether to release the rail first.",
    "pieces": [
      {
        "outline": [
          [
            160,
            90
          ],
          [
            245,
            160
          ],
          [
            160,
            230
          ],
          [
            75,
            160
          ]
        ],
        "anchors": [
          [
            160,
            120
          ],
          [
            160,
            200
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            300
          ],
          [
            280,
            270
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        3,
        [
          245,
          35
        ]
      ],
      [
        1,
        [
          280,
          270
        ]
      ],
      [
        0,
        [
          55,
          300
        ]
      ]
    ]
  },
  {
    "id": "v7-two-sails",
    "name": "Two sails",
    "packIndex": 1,
    "tip": "The low sail blocks the upper one. Their different hinge heights matter.",
    "rationale": "The low sail blocks the upper one. Their different hinge heights matter.",
    "pieces": [
      {
        "outline": [
          [
            60,
            85
          ],
          [
            270,
            85
          ],
          [
            165,
            200
          ]
        ],
        "anchors": [
          [
            110,
            110
          ],
          [
            220,
            110
          ]
        ]
      },
      {
        "outline": [
          [
            95,
            245
          ],
          [
            295,
            245
          ],
          [
            195,
            355
          ]
        ],
        "anchors": [
          [
            145,
            270
          ],
          [
            245,
            270
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        3,
        [
          245,
          35
        ]
      ],
      [
        0,
        [
          145,
          270
        ]
      ],
      [
        1,
        [
          110,
          110
        ]
      ]
    ]
  },
  {
    "id": "v7-offset-elbows",
    "name": "Offset elbows",
    "packIndex": 1,
    "tip": "Two differently sized elbows can hook each other. Free the low foot before the upper one.",
    "rationale": "Two differently sized elbows can hook each other. Free the low foot before the upper one.",
    "pieces": [
      {
        "outline": [
          [
            45,
            80
          ],
          [
            85,
            80
          ],
          [
            85,
            190
          ],
          [
            195,
            190
          ],
          [
            195,
            230
          ],
          [
            45,
            230
          ]
        ],
        "components": [
          [
            [
              45,
              80
            ],
            [
              85,
              80
            ],
            [
              85,
              190
            ],
            [
              45,
              190
            ]
          ],
          [
            [
              45,
              190
            ],
            [
              195,
              190
            ],
            [
              195,
              230
            ],
            [
              45,
              230
            ]
          ]
        ],
        "anchors": [
          [
            65,
            105
          ],
          [
            165,
            210
          ]
        ]
      },
      {
        "outline": [
          [
            235,
            160
          ],
          [
            275,
            160
          ],
          [
            275,
            300
          ],
          [
            300,
            300
          ],
          [
            300,
            340
          ],
          [
            235,
            340
          ]
        ],
        "components": [
          [
            [
              235,
              160
            ],
            [
              275,
              160
            ],
            [
              275,
              300
            ],
            [
              235,
              300
            ]
          ],
          [
            [
              235,
              300
            ],
            [
              300,
              300
            ],
            [
              300,
              340
            ],
            [
              235,
              340
            ]
          ]
        ],
        "anchors": [
          [
            255,
            185
          ],
          [
            275,
            320
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        3,
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
          165,
          210
        ]
      ],
      [
        0,
        [
          255,
          185
        ]
      ]
    ]
  },
  {
    "id": "v7-capped-spindle",
    "name": "Capped spindle",
    "packIndex": 1,
    "tip": "A single-pin cap hangs above a three-pin spindle. Clear space before choosing the spindle’s last hinge.",
    "rationale": "A single-pin cap hangs above a three-pin spindle. Clear space before choosing the spindle’s last hinge.",
    "pieces": [
      {
        "outline": [
          [
            90,
            80
          ],
          [
            260,
            80
          ],
          [
            260,
            125
          ],
          [
            90,
            125
          ]
        ],
        "anchors": [
          [
            175,
            102
          ]
        ]
      },
      {
        "outline": [
          [
            85,
            180
          ],
          [
            265,
            180
          ],
          [
            265,
            220
          ],
          [
            195,
            220
          ],
          [
            195,
            340
          ],
          [
            155,
            340
          ],
          [
            155,
            220
          ],
          [
            85,
            220
          ]
        ],
        "components": [
          [
            [
              85,
              180
            ],
            [
              265,
              180
            ],
            [
              265,
              220
            ],
            [
              85,
              220
            ]
          ],
          [
            [
              155,
              220
            ],
            [
              195,
              220
            ],
            [
              195,
              340
            ],
            [
              155,
              340
            ]
          ]
        ],
        "anchors": [
          [
            110,
            200
          ],
          [
            240,
            200
          ],
          [
            175,
            310
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        3,
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
          110,
          200
        ]
      ],
      [
        0,
        [
          175,
          310
        ]
      ]
    ]
  },
  {
    "id": "v7-wide-shoulders",
    "name": "Wide shoulders",
    "packIndex": 1,
    "tip": "The broad shoulders sit above two separate stops. Open a path on one side.",
    "rationale": "The broad shoulders sit above two separate stops. Open a path on one side.",
    "pieces": [
      {
        "outline": [
          [
            70,
            85
          ],
          [
            280,
            85
          ],
          [
            280,
            125
          ],
          [
            195,
            125
          ],
          [
            195,
            215
          ],
          [
            155,
            215
          ],
          [
            155,
            125
          ],
          [
            70,
            125
          ]
        ],
        "components": [
          [
            [
              70,
              85
            ],
            [
              280,
              85
            ],
            [
              280,
              125
            ],
            [
              70,
              125
            ]
          ],
          [
            [
              155,
              125
            ],
            [
              195,
              125
            ],
            [
              195,
              215
            ],
            [
              155,
              215
            ]
          ]
        ],
        "anchors": [
          [
            100,
            105
          ],
          [
            250,
            105
          ],
          [
            175,
            185
          ]
        ]
      },
      {
        "bar": [
          [
            70,
            285
          ],
          [
            130,
            285
          ]
        ]
      },
      {
        "bar": [
          [
            225,
            270
          ],
          [
            285,
            270
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
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
        2,
        [
          70,
          285
        ]
      ],
      [
        0,
        [
          130,
          285
        ]
      ],
      [
        5,
        [
          100,
          105
        ]
      ],
      [
        1,
        [
          175,
          185
        ]
      ],
      [
        6,
        [
          250,
          105
        ]
      ]
    ]
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
  },
  {
    "id": "v7-double-pendulum",
    "name": "Double pendulum",
    "packIndex": 2,
    "tip": "Two long pendulums share the space above a low gate. One pin each is enough to keep them hanging.",
    "rationale": "Two long pendulums share the space above a low gate. One pin each is enough to keep them hanging.",
    "pieces": [
      {
        "outline": [
          [
            55,
            80
          ],
          [
            110,
            80
          ],
          [
            110,
            250
          ],
          [
            55,
            250
          ]
        ],
        "anchors": [
          [
            82,
            110
          ]
        ]
      },
      {
        "outline": [
          [
            225,
            115
          ],
          [
            280,
            115
          ],
          [
            280,
            285
          ],
          [
            225,
            285
          ]
        ],
        "anchors": [
          [
            252,
            145
          ]
        ]
      },
      {
        "bar": [
          [
            65,
            350
          ],
          [
            285,
            350
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        3,
        [
          245,
          35
        ]
      ],
      [
        1,
        [
          65,
          350
        ]
      ],
      [
        0,
        [
          252,
          145
        ]
      ]
    ]
  },
  {
    "id": "v7-crossed-intentions",
    "name": "Crossed intentions",
    "packIndex": 2,
    "tip": "Slanted rails guide the little block toward different exits. Work out the rail order.",
    "rationale": "Slanted rails guide the little block toward different exits. Work out the rail order.",
    "pieces": [
      {
        "outline": [
          [
            145,
            70
          ],
          [
            205,
            70
          ],
          [
            205,
            140
          ],
          [
            145,
            140
          ]
        ],
        "anchors": [
          [
            175,
            100
          ]
        ]
      },
      {
        "bar": [
          [
            50,
            200
          ],
          [
            190,
            240
          ]
        ]
      },
      {
        "bar": [
          [
            190,
            320
          ],
          [
            295,
            260
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
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
        2,
        [
          295,
          260
        ]
      ],
      [
        1,
        [
          190,
          240
        ]
      ],
      [
        0,
        [
          50,
          200
        ]
      ]
    ]
  },
  {
    "id": "v7-archway",
    "name": "Archway",
    "packIndex": 2,
    "tip": "The suspended crossbar sits between two upright posts. A parked screw can close the opening.",
    "rationale": "The suspended crossbar sits between two upright posts. A parked screw can close the opening.",
    "pieces": [
      {
        "bar": [
          [
            80,
            100
          ],
          [
            270,
            100
          ]
        ]
      },
      {
        "outline": [
          [
            45,
            190
          ],
          [
            100,
            190
          ],
          [
            100,
            330
          ],
          [
            45,
            330
          ]
        ],
        "anchors": [
          [
            72,
            215
          ],
          [
            72,
            305
          ]
        ]
      },
      {
        "outline": [
          [
            250,
            190
          ],
          [
            305,
            190
          ],
          [
            305,
            330
          ],
          [
            250,
            330
          ]
        ],
        "anchors": [
          [
            277,
            215
          ],
          [
            277,
            305
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        3,
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
        5,
        [
          72,
          215
        ]
      ],
      [
        4,
        [
          72,
          305
        ]
      ],
      [
        0,
        [
          277,
          215
        ]
      ],
      [
        1,
        [
          80,
          100
        ]
      ]
    ]
  },
  {
    "id": "v7-forked-landing",
    "name": "Forked landing",
    "packIndex": 2,
    "tip": "A broad diamond lands across two uneven supports. Free one side without plugging the other.",
    "rationale": "A broad diamond lands across two uneven supports. Free one side without plugging the other.",
    "pieces": [
      {
        "outline": [
          [
            175,
            75
          ],
          [
            270,
            155
          ],
          [
            175,
            235
          ],
          [
            80,
            155
          ]
        ],
        "anchors": [
          [
            175,
            105
          ],
          [
            175,
            205
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            285
          ],
          [
            135,
            285
          ]
        ]
      },
      {
        "bar": [
          [
            220,
            310
          ],
          [
            290,
            310
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
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
        2,
        [
          220,
          310
        ]
      ],
      [
        3,
        [
          55,
          285
        ]
      ],
      [
        0,
        [
          290,
          310
        ]
      ],
      [
        1,
        [
          175,
          105
        ]
      ]
    ]
  },
  {
    "id": "v7-bracket-bridge",
    "name": "Bracket bridge",
    "packIndex": 2,
    "tip": "The bridge catches on the elbow and the short post. Choose which support becomes a hinge.",
    "rationale": "The bridge catches on the elbow and the short post. Choose which support becomes a hinge.",
    "pieces": [
      {
        "bar": [
          [
            65,
            100
          ],
          [
            285,
            100
          ]
        ]
      },
      {
        "outline": [
          [
            55,
            190
          ],
          [
            95,
            190
          ],
          [
            95,
            290
          ],
          [
            170,
            290
          ],
          [
            170,
            330
          ],
          [
            55,
            330
          ]
        ],
        "components": [
          [
            [
              55,
              190
            ],
            [
              95,
              190
            ],
            [
              95,
              290
            ],
            [
              55,
              290
            ]
          ],
          [
            [
              55,
              290
            ],
            [
              170,
              290
            ],
            [
              170,
              330
            ],
            [
              55,
              330
            ]
          ]
        ],
        "anchors": [
          [
            75,
            215
          ],
          [
            140,
            310
          ]
        ]
      },
      {
        "outline": [
          [
            240,
            195
          ],
          [
            295,
            195
          ],
          [
            295,
            325
          ],
          [
            240,
            325
          ]
        ],
        "anchors": [
          [
            267,
            220
          ],
          [
            267,
            300
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        3,
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
        5,
        [
          75,
          215
        ]
      ],
      [
        4,
        [
          140,
          310
        ]
      ],
      [
        1,
        [
          267,
          300
        ]
      ],
      [
        0,
        [
          285,
          100
        ]
      ]
    ]
  },
  {
    "id": "v7-keel-and-cradle",
    "name": "Keel and cradle",
    "packIndex": 2,
    "tip": "The triangular keel drops into a two-part cradle. Clear a cradle arm to release it.",
    "rationale": "The triangular keel drops into a two-part cradle. Clear a cradle arm to release it.",
    "pieces": [
      {
        "outline": [
          [
            75,
            80
          ],
          [
            275,
            80
          ],
          [
            175,
            230
          ]
        ],
        "anchors": [
          [
            115,
            110
          ],
          [
            235,
            110
          ],
          [
            175,
            185
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            275
          ],
          [
            145,
            315
          ]
        ]
      },
      {
        "bar": [
          [
            210,
            315
          ],
          [
            295,
            270
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
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
        6,
        [
          145,
          315
        ]
      ],
      [
        0,
        [
          295,
          270
        ]
      ],
      [
        1,
        [
          210,
          315
        ]
      ],
      [
        3,
        [
          235,
          110
        ]
      ],
      [
        2,
        [
          115,
          110
        ]
      ]
    ]
  },
  {
    "id": "v5-cradle",
    "name": "Cradle",
    "rationale": "A U-shaped cradle catches the inner paddle. Its two legs and floor move as one piece, so the pivot choice controls whether the paddle tips out or stays cupped.",
    "tip": "The cradle is one piece. Which end should stay pinned while it tips?",
    "pieces": [
      {
        "outline": [
          [
            65,
            205
          ],
          [
            105,
            205
          ],
          [
            105,
            325
          ],
          [
            245,
            325
          ],
          [
            245,
            205
          ],
          [
            285,
            205
          ],
          [
            285,
            365
          ],
          [
            65,
            365
          ]
        ],
        "components": [
          [
            [
              65,
              205
            ],
            [
              105,
              205
            ],
            [
              105,
              325
            ],
            [
              65,
              325
            ]
          ],
          [
            [
              245,
              205
            ],
            [
              285,
              205
            ],
            [
              285,
              325
            ],
            [
              245,
              325
            ]
          ],
          [
            [
              65,
              325
            ],
            [
              285,
              325
            ],
            [
              285,
              365
            ],
            [
              65,
              365
            ]
          ]
        ],
        "anchors": [
          [
            85,
            230
          ],
          [
            265,
            230
          ],
          [
            175,
            345
          ]
        ]
      },
      {
        "outline": [
          [
            140,
            90
          ],
          [
            210,
            90
          ],
          [
            210,
            155
          ],
          [
            190,
            180
          ],
          [
            160,
            180
          ],
          [
            140,
            155
          ]
        ],
        "anchors": [
          [
            160,
            115
          ],
          [
            190,
            150
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          175,
          345
        ]
      ],
      [
        1,
        [
          85,
          230
        ]
      ],
      [
        3,
        [
          265,
          230
        ]
      ]
    ],
    "alternateSolution": [
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
          160,
          115
        ]
      ],
      [
        0,
        [
          190,
          150
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
          85,
          230
        ]
      ]
    ]
  },
  {
    "id": "v5-pendulum-relay",
    "name": "Pendulum relay",
    "rationale": "Two hanging diamonds sweep into a shared shelf. Choose a side pivot and release the shelf to clear their crossing paths.",
    "tip": "The two diamonds share an exit. A loose diamond can rest on the shelf.",
    "pieces": [
      {
        "outline": [
          [
            70,
            85
          ],
          [
            130,
            145
          ],
          [
            70,
            205
          ],
          [
            10,
            145
          ]
        ],
        "anchors": [
          [
            70,
            115
          ],
          [
            70,
            175
          ]
        ]
      },
      {
        "outline": [
          [
            265,
            120
          ],
          [
            325,
            180
          ],
          [
            265,
            240
          ],
          [
            205,
            180
          ]
        ],
        "anchors": [
          [
            265,
            150
          ],
          [
            265,
            210
          ]
        ]
      },
      {
        "bar": [
          [
            90,
            285
          ],
          [
            260,
            285
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        1,
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
        5,
        [
          70,
          115
        ]
      ],
      [
        2,
        [
          70,
          175
        ]
      ],
      [
        3,
        [
          265,
          150
        ]
      ],
      [
        4,
        [
          265,
          210
        ]
      ]
    ]
  },
  {
    "id": "v5-offset-key",
    "name": "Offset key",
    "rationale": "A stepped key carries mass to both sides of three mounting points. A short lower stop and side rail make the final pivot matter more than the first screw.",
    "tip": "Three pins fix the stepped key. Leave a pivot that lets its wide lower foot clear the stop.",
    "pieces": [
      {
        "outline": [
          [
            65,
            95
          ],
          [
            195,
            95
          ],
          [
            195,
            180
          ],
          [
            265,
            180
          ],
          [
            265,
            230
          ],
          [
            145,
            230
          ],
          [
            145,
            145
          ],
          [
            65,
            145
          ]
        ],
        "components": [
          [
            [
              65,
              95
            ],
            [
              195,
              95
            ],
            [
              195,
              145
            ],
            [
              65,
              145
            ]
          ],
          [
            [
              145,
              145
            ],
            [
              195,
              145
            ],
            [
              195,
              180
            ],
            [
              145,
              180
            ]
          ],
          [
            [
              145,
              180
            ],
            [
              265,
              180
            ],
            [
              265,
              230
            ],
            [
              145,
              230
            ]
          ]
        ],
        "anchors": [
          [
            90,
            120
          ],
          [
            170,
            120
          ],
          [
            230,
            205
          ]
        ]
      },
      {
        "bar": [
          [
            65,
            280
          ],
          [
            180,
            280
          ]
        ]
      },
      {
        "bar": [
          [
            305,
            240
          ],
          [
            305,
            340
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        6,
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
          180,
          280
        ]
      ],
      [
        2,
        [
          305,
          240
        ]
      ],
      [
        1,
        [
          305,
          340
        ]
      ],
      [
        0,
        [
          230,
          205
        ]
      ],
      [
        3,
        [
          90,
          120
        ]
      ]
    ]
  },
  {
    "id": "v5-locksmith",
    "name": "Locksmith",
    "rationale": "A broad hexagonal plate sits over two uneven shelves and a center gate. Free space is shared: the shelf released first changes the large plate’s route and the mounting holes available for parking.",
    "tip": "Open a side route before releasing the broad plate. Keep a clear hole for the center gate.",
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
            295,
            150
          ],
          [
            260,
            200
          ],
          [
            90,
            200
          ],
          [
            55,
            150
          ]
        ],
        "anchors": [
          [
            100,
            125
          ],
          [
            250,
            125
          ],
          [
            175,
            175
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            250
          ],
          [
            140,
            250
          ]
        ]
      },
      {
        "bar": [
          [
            220,
            275
          ],
          [
            300,
            275
          ]
        ]
      },
      {
        "outline": [
          [
            160,
            255
          ],
          [
            190,
            255
          ],
          [
            190,
            365
          ],
          [
            160,
            365
          ]
        ],
        "anchors": [
          [
            175,
            280
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
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
          220,
          275
        ]
      ],
      [
        0,
        [
          250,
          125
        ]
      ],
      [
        7,
        [
          100,
          125
        ]
      ],
      [
        3,
        [
          175,
          280
        ]
      ],
      [
        6,
        [
          55,
          250
        ]
      ],
      [
        4,
        [
          300,
          275
        ]
      ]
    ]
  },
  {
    "id": "v7-balance-exchange",
    "name": "Balance exchange",
    "packIndex": 3,
    "tip": "The bridge can catch the two single-pin weights. Their vacated holes are useful but not always safe.",
    "rationale": "The bridge can catch the two single-pin weights. Their vacated holes are useful but not always safe.",
    "pieces": [
      {
        "outline": [
          [
            50,
            75
          ],
          [
            120,
            75
          ],
          [
            120,
            165
          ],
          [
            50,
            165
          ]
        ],
        "anchors": [
          [
            85,
            105
          ]
        ]
      },
      {
        "outline": [
          [
            260,
            90
          ],
          [
            305,
            150
          ],
          [
            260,
            210
          ],
          [
            215,
            150
          ]
        ],
        "anchors": [
          [
            260,
            130
          ]
        ]
      },
      {
        "bar": [
          [
            80,
            260
          ],
          [
            270,
            260
          ]
        ]
      },
      {
        "bar": [
          [
            125,
            370
          ],
          [
            235,
            370
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
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
        2,
        [
          125,
          370
        ]
      ],
      [
        3,
        [
          80,
          260
        ]
      ],
      [
        1,
        [
          270,
          260
        ]
      ],
      [
        0,
        [
          260,
          130
        ]
      ]
    ]
  },
  {
    "id": "v7-hinged-chute",
    "name": "Hinged chute",
    "packIndex": 3,
    "tip": "The upper sail rides into two sloping gates. Changing the first hinge changes where it lands.",
    "rationale": "The upper sail rides into two sloping gates. Changing the first hinge changes where it lands.",
    "pieces": [
      {
        "outline": [
          [
            85,
            65
          ],
          [
            265,
            65
          ],
          [
            175,
            175
          ]
        ],
        "anchors": [
          [
            125,
            90
          ],
          [
            225,
            90
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            230
          ],
          [
            145,
            265
          ]
        ]
      },
      {
        "bar": [
          [
            215,
            310
          ],
          [
            300,
            260
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        4,
        [
          105,
          35
        ]
      ],
      [
        3,
        [
          245,
          35
        ]
      ],
      [
        5,
        [
          145,
          265
        ]
      ],
      [
        2,
        [
          300,
          260
        ]
      ],
      [
        0,
        [
          55,
          230
        ]
      ],
      [
        1,
        [
          125,
          90
        ]
      ]
    ]
  },
  {
    "id": "v7-nested-fall",
    "name": "Nested fall",
    "packIndex": 3,
    "tip": "A central weight meets three staggered rails. Clear a lane rather than simply stripping the top.",
    "rationale": "A central weight meets three staggered rails. Clear a lane rather than simply stripping the top.",
    "pieces": [
      {
        "outline": [
          [
            140,
            65
          ],
          [
            210,
            65
          ],
          [
            210,
            155
          ],
          [
            140,
            155
          ]
        ],
        "anchors": [
          [
            175,
            95
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            215
          ],
          [
            180,
            215
          ]
        ]
      },
      {
        "bar": [
          [
            200,
            280
          ],
          [
            295,
            280
          ]
        ]
      },
      {
        "bar": [
          [
            80,
            365
          ],
          [
            245,
            365
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        5,
        [
          105,
          35
        ]
      ],
      [
        6,
        [
          245,
          35
        ]
      ],
      [
        3,
        [
          80,
          365
        ]
      ],
      [
        4,
        [
          200,
          280
        ]
      ],
      [
        1,
        [
          295,
          280
        ]
      ],
      [
        2,
        [
          55,
          215
        ]
      ],
      [
        0,
        [
          180,
          215
        ]
      ]
    ]
  },
  {
    "id": "v7-shoulder-transfer",
    "name": "Shoulder transfer",
    "packIndex": 3,
    "tip": "A broad T rests on an offset elbow and a short shelf. Make space for the long stem.",
    "rationale": "A broad T rests on an offset elbow and a short shelf. Make space for the long stem.",
    "pieces": [
      {
        "outline": [
          [
            65,
            65
          ],
          [
            285,
            65
          ],
          [
            285,
            105
          ],
          [
            195,
            105
          ],
          [
            195,
            215
          ],
          [
            155,
            215
          ],
          [
            155,
            105
          ],
          [
            65,
            105
          ]
        ],
        "components": [
          [
            [
              65,
              65
            ],
            [
              285,
              65
            ],
            [
              285,
              105
            ],
            [
              65,
              105
            ]
          ],
          [
            [
              155,
              105
            ],
            [
              195,
              105
            ],
            [
              195,
              215
            ],
            [
              155,
              215
            ]
          ]
        ],
        "anchors": [
          [
            95,
            85
          ],
          [
            255,
            85
          ],
          [
            175,
            185
          ]
        ]
      },
      {
        "outline": [
          [
            50,
            245
          ],
          [
            85,
            245
          ],
          [
            85,
            335
          ],
          [
            165,
            335
          ],
          [
            165,
            370
          ],
          [
            50,
            370
          ]
        ],
        "components": [
          [
            [
              50,
              245
            ],
            [
              85,
              245
            ],
            [
              85,
              335
            ],
            [
              50,
              335
            ]
          ],
          [
            [
              50,
              335
            ],
            [
              165,
              335
            ],
            [
              165,
              370
            ],
            [
              50,
              370
            ]
          ]
        ],
        "anchors": [
          [
            67,
            270
          ],
          [
            140,
            352
          ]
        ]
      },
      {
        "bar": [
          [
            225,
            285
          ],
          [
            295,
            285
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
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
        6,
        [
          225,
          285
        ]
      ],
      [
        2,
        [
          295,
          285
        ]
      ],
      [
        1,
        [
          140,
          352
        ]
      ],
      [
        3,
        [
          255,
          85
        ]
      ],
      [
        0,
        [
          175,
          185
        ]
      ]
    ]
  },
  {
    "id": "v7-relay-tower",
    "name": "Relay tower",
    "packIndex": 3,
    "tip": "Each ledge can receive the piece above it. Open a route before releasing the top weight.",
    "rationale": "Each ledge can receive the piece above it. Open a route before releasing the top weight.",
    "pieces": [
      {
        "outline": [
          [
            175,
            65
          ],
          [
            230,
            115
          ],
          [
            175,
            165
          ],
          [
            120,
            115
          ]
        ],
        "anchors": [
          [
            175,
            100
          ]
        ]
      },
      {
        "bar": [
          [
            70,
            215
          ],
          [
            230,
            215
          ]
        ]
      },
      {
        "bar": [
          [
            130,
            305
          ],
          [
            285,
            305
          ]
        ]
      },
      {
        "bar": [
          [
            65,
            385
          ],
          [
            235,
            385
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        5,
        [
          105,
          35
        ]
      ],
      [
        6,
        [
          245,
          35
        ]
      ],
      [
        3,
        [
          65,
          385
        ]
      ],
      [
        4,
        [
          130,
          305
        ]
      ],
      [
        1,
        [
          285,
          305
        ]
      ],
      [
        2,
        [
          70,
          215
        ]
      ],
      [
        0,
        [
          230,
          215
        ]
      ]
    ]
  },
  {
    "id": "v7-four-way-handoff",
    "name": "Four-way handoff",
    "packIndex": 3,
    "tip": "A wide sail passes through three independent gates. Manage both parking holes across the chain.",
    "rationale": "A wide sail passes through three independent gates. Manage both parking holes across the chain.",
    "pieces": [
      {
        "outline": [
          [
            85,
            60
          ],
          [
            265,
            60
          ],
          [
            175,
            180
          ]
        ],
        "anchors": [
          [
            125,
            85
          ],
          [
            225,
            85
          ],
          [
            175,
            135
          ]
        ]
      },
      {
        "bar": [
          [
            45,
            250
          ],
          [
            125,
            250
          ]
        ]
      },
      {
        "bar": [
          [
            230,
            280
          ],
          [
            300,
            280
          ]
        ]
      },
      {
        "bar": [
          [
            100,
            370
          ],
          [
            250,
            370
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        7,
        [
          105,
          35
        ]
      ],
      [
        8,
        [
          245,
          35
        ]
      ],
      [
        5,
        [
          100,
          370
        ]
      ],
      [
        6,
        [
          230,
          280
        ]
      ],
      [
        3,
        [
          300,
          280
        ]
      ],
      [
        2,
        [
          45,
          250
        ]
      ],
      [
        0,
        [
          250,
          370
        ]
      ],
      [
        1,
        [
          125,
          85
        ]
      ],
      [
        4,
        [
          225,
          85
        ]
      ]
    ]
  },
  {
    "id": "v6-pivot-fan",
    "name": "Fan and stop",
    "tip": "Three pins fix the fan. Choose the final pivot before opening the stop.",
    "rationale": "A broad, asymmetric fan pivots above a narrow lower stop. The final pin changes which side sweeps through the exit.",
    "pieces": [
      {
        "outline": [
          [
            80,
            100
          ],
          [
            245,
            100
          ],
          [
            290,
            210
          ],
          [
            170,
            245
          ],
          [
            60,
            180
          ]
        ],
        "anchors": [
          [
            105,
            125
          ],
          [
            225,
            125
          ],
          [
            175,
            205
          ]
        ]
      },
      {
        "bar": [
          [
            100,
            300
          ],
          [
            240,
            300
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
        [
          245,
          35
        ]
      ],
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
          105,
          125
        ]
      ],
      [
        1,
        [
          240,
          300
        ]
      ],
      [
        3,
        [
          225,
          125
        ]
      ]
    ]
  },
  {
    "id": "v6-pivot-hammer",
    "name": "Hammer swing",
    "tip": "The hammer is heavy on one side. Make room for its head before releasing the handle.",
    "rationale": "A concave hammer has an offset head and handle; a one-pin rail and a two-pin shelf constrain different portions of its swing.",
    "pieces": [
      {
        "outline": [
          [
            75,
            90
          ],
          [
            265,
            90
          ],
          [
            265,
            145
          ],
          [
            190,
            145
          ],
          [
            190,
            250
          ],
          [
            145,
            250
          ],
          [
            145,
            145
          ],
          [
            75,
            145
          ]
        ],
        "components": [
          [
            [
              75,
              90
            ],
            [
              265,
              90
            ],
            [
              265,
              145
            ],
            [
              75,
              145
            ]
          ],
          [
            [
              145,
              145
            ],
            [
              190,
              145
            ],
            [
              190,
              250
            ],
            [
              145,
              250
            ]
          ]
        ],
        "anchors": [
          [
            100,
            115
          ],
          [
            240,
            115
          ],
          [
            168,
            220
          ]
        ]
      },
      {
        "outline": [
          [
            295,
            170
          ],
          [
            325,
            170
          ],
          [
            325,
            280
          ],
          [
            295,
            280
          ]
        ],
        "anchors": [
          [
            310,
            190
          ]
        ]
      },
      {
        "bar": [
          [
            80,
            310
          ],
          [
            225,
            310
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        1,
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
        3,
        [
          240,
          115
        ]
      ],
      [
        0,
        [
          310,
          190
        ]
      ],
      [
        4,
        [
          168,
          220
        ]
      ],
      [
        5,
        [
          80,
          310
        ]
      ]
    ]
  },
  {
    "id": "v6-pivot-stair",
    "name": "Stair turn",
    "tip": "Leave room for the lower step to swing. The two small ledges share its exit.",
    "rationale": "A stepped plate must rotate between two staggered ledges. A low last pivot inverts the mass, unlike an upper pivot.",
    "pieces": [
      {
        "outline": [
          [
            65,
            90
          ],
          [
            160,
            90
          ],
          [
            160,
            140
          ],
          [
            215,
            140
          ],
          [
            215,
            190
          ],
          [
            270,
            190
          ],
          [
            270,
            240
          ],
          [
            120,
            240
          ],
          [
            120,
            190
          ],
          [
            65,
            190
          ]
        ],
        "components": [
          [
            [
              65,
              90
            ],
            [
              160,
              90
            ],
            [
              160,
              140
            ],
            [
              65,
              140
            ]
          ],
          [
            [
              65,
              140
            ],
            [
              215,
              140
            ],
            [
              215,
              190
            ],
            [
              65,
              190
            ]
          ],
          [
            [
              120,
              190
            ],
            [
              270,
              190
            ],
            [
              270,
              240
            ],
            [
              120,
              240
            ]
          ]
        ],
        "anchors": [
          [
            90,
            115
          ],
          [
            185,
            165
          ],
          [
            240,
            215
          ]
        ]
      },
      {
        "bar": [
          [
            60,
            290
          ],
          [
            140,
            290
          ]
        ]
      },
      {
        "bar": [
          [
            230,
            325
          ],
          [
            300,
            325
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        6,
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
          300,
          325
        ]
      ],
      [
        5,
        [
          90,
          115
        ]
      ],
      [
        2,
        [
          230,
          325
        ]
      ],
      [
        4,
        [
          240,
          215
        ]
      ],
      [
        3,
        [
          185,
          165
        ]
      ]
    ]
  },
  {
    "id": "v6-pivot-crown",
    "name": "Crown gate",
    "tip": "The crown has three pins. Clear an escape past the two hanging gates, not just beneath the crown.",
    "rationale": "An open crown-shaped three-pin body spans two separately hinged side gates and a lower shelf. Its concavity and the side-gate pivots create competing paths.",
    "pieces": [
      {
        "outline": [
          [
            60,
            90
          ],
          [
            100,
            90
          ],
          [
            100,
            150
          ],
          [
            155,
            150
          ],
          [
            155,
            105
          ],
          [
            195,
            105
          ],
          [
            195,
            150
          ],
          [
            250,
            150
          ],
          [
            250,
            90
          ],
          [
            290,
            90
          ],
          [
            290,
            200
          ],
          [
            60,
            200
          ]
        ],
        "components": [
          [
            [
              60,
              90
            ],
            [
              100,
              90
            ],
            [
              100,
              150
            ],
            [
              60,
              150
            ]
          ],
          [
            [
              155,
              105
            ],
            [
              195,
              105
            ],
            [
              195,
              150
            ],
            [
              155,
              150
            ]
          ],
          [
            [
              250,
              90
            ],
            [
              290,
              90
            ],
            [
              290,
              150
            ],
            [
              250,
              150
            ]
          ],
          [
            [
              60,
              150
            ],
            [
              290,
              150
            ],
            [
              290,
              200
            ],
            [
              60,
              200
            ]
          ]
        ],
        "anchors": [
          [
            80,
            120
          ],
          [
            175,
            175
          ],
          [
            270,
            120
          ]
        ]
      },
      {
        "outline": [
          [
            55,
            235
          ],
          [
            85,
            235
          ],
          [
            85,
            340
          ],
          [
            55,
            340
          ]
        ],
        "anchors": [
          [
            70,
            255
          ]
        ]
      },
      {
        "outline": [
          [
            265,
            235
          ],
          [
            295,
            235
          ],
          [
            295,
            340
          ],
          [
            265,
            340
          ]
        ],
        "anchors": [
          [
            280,
            255
          ],
          [
            280,
            315
          ]
        ]
      },
      {
        "bar": [
          [
            125,
            365
          ],
          [
            225,
            365
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
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
          105,
          35
        ]
      ],
      [
        3,
        [
          280,
          315
        ]
      ],
      [
        2,
        [
          70,
          255
        ]
      ],
      [
        6,
        [
          280,
          255
        ]
      ],
      [
        1,
        [
          125,
          365
        ]
      ],
      [
        7,
        [
          270,
          120
        ]
      ],
      [
        0,
        [
          175,
          175
        ]
      ]
    ]
  },
  {
    "packIndex": 4,
    "id": "v7-offset-pendulum",
    "name": "Offset pendulum",
    "tip": "Choose the hinge that swings the long arm away from the short stop.",
    "rationale": "Choose the hinge that swings the long arm away from the short stop.",
    "pieces": [
      {
        "outline": [
          [
            55,
            95
          ],
          [
            245,
            95
          ],
          [
            245,
            135
          ],
          [
            95,
            135
          ],
          [
            95,
            215
          ],
          [
            55,
            215
          ]
        ],
        "components": [
          [
            [
              55,
              95
            ],
            [
              245,
              95
            ],
            [
              245,
              135
            ],
            [
              55,
              135
            ]
          ],
          [
            [
              55,
              135
            ],
            [
              95,
              135
            ],
            [
              95,
              215
            ],
            [
              55,
              215
            ]
          ]
        ],
        "anchors": [
          [
            80,
            115
          ],
          [
            220,
            115
          ]
        ]
      },
      {
        "bar": [
          [
            110,
            265
          ],
          [
            260,
            265
          ]
        ]
      },
      {
        "outline": [
          [
            265,
            100
          ],
          [
            300,
            100
          ],
          [
            300,
            200
          ],
          [
            265,
            200
          ]
        ],
        "anchors": [
          [
            282,
            120
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
        4,
        [
          80,
          115
        ]
      ],
      [
        2,
        [
          220,
          115
        ]
      ],
      [
        3,
        [
          282,
          120
        ]
      ]
    ]
  },
  {
    "packIndex": 4,
    "id": "v7-suspended-sail",
    "name": "Suspended sail",
    "tip": "The sail needs turning room before its lower pin can be reused.",
    "rationale": "The sail needs turning room before its lower pin can be reused.",
    "pieces": [
      {
        "outline": [
          [
            60,
            230
          ],
          [
            150,
            85
          ],
          [
            240,
            230
          ]
        ],
        "anchors": [
          [
            150,
            125
          ],
          [
            100,
            200
          ],
          [
            195,
            200
          ]
        ]
      },
      {
        "bar": [
          [
            60,
            290
          ],
          [
            180,
            290
          ]
        ]
      },
      {
        "bar": [
          [
            260,
            260
          ],
          [
            290,
            350
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          150,
          125
        ]
      ],
      [
        3,
        [
          100,
          200
        ]
      ],
      [
        4,
        [
          60,
          290
        ]
      ],
      [
        5,
        [
          195,
          200
        ]
      ],
      [
        6,
        [
          260,
          260
        ]
      ]
    ]
  },
  {
    "packIndex": 4,
    "id": "v7-double-elbow",
    "name": "Double elbow",
    "tip": "The two elbows turn through different spaces; free one side before the other.",
    "rationale": "The two elbows turn through different spaces; free one side before the other.",
    "pieces": [
      {
        "outline": [
          [
            40,
            90
          ],
          [
            165,
            90
          ],
          [
            165,
            125
          ],
          [
            75,
            125
          ],
          [
            75,
            230
          ],
          [
            40,
            230
          ]
        ],
        "components": [
          [
            [
              40,
              90
            ],
            [
              165,
              90
            ],
            [
              165,
              125
            ],
            [
              40,
              125
            ]
          ],
          [
            [
              40,
              125
            ],
            [
              75,
              125
            ],
            [
              75,
              230
            ],
            [
              40,
              230
            ]
          ]
        ],
        "anchors": [
          [
            60,
            110
          ],
          [
            140,
            110
          ]
        ]
      },
      {
        "outline": [
          [
            200,
            160
          ],
          [
            310,
            160
          ],
          [
            310,
            195
          ],
          [
            235,
            195
          ],
          [
            235,
            295
          ],
          [
            200,
            295
          ]
        ],
        "components": [
          [
            [
              200,
              160
            ],
            [
              310,
              160
            ],
            [
              310,
              195
            ],
            [
              200,
              195
            ]
          ],
          [
            [
              200,
              195
            ],
            [
              235,
              195
            ],
            [
              235,
              295
            ],
            [
              200,
              295
            ]
          ]
        ],
        "anchors": [
          [
            220,
            180
          ],
          [
            220,
            270
          ]
        ]
      },
      {
        "bar": [
          [
            75,
            355
          ],
          [
            240,
            355
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          60,
          110
        ]
      ],
      [
        3,
        [
          140,
          110
        ]
      ],
      [
        4,
        [
          220,
          180
        ]
      ],
      [
        5,
        [
          220,
          270
        ]
      ]
    ]
  },
  {
    "packIndex": 4,
    "id": "v7-counterweight",
    "name": "Counterweight",
    "tip": "The wide head will tip the narrow stem; keep its landing zone clear.",
    "rationale": "The wide head will tip the narrow stem; keep its landing zone clear.",
    "pieces": [
      {
        "outline": [
          [
            65,
            85
          ],
          [
            275,
            85
          ],
          [
            275,
            125
          ],
          [
            190,
            125
          ],
          [
            190,
            235
          ],
          [
            150,
            235
          ],
          [
            150,
            125
          ],
          [
            65,
            125
          ]
        ],
        "components": [
          [
            [
              65,
              85
            ],
            [
              275,
              85
            ],
            [
              275,
              125
            ],
            [
              65,
              125
            ]
          ],
          [
            [
              150,
              125
            ],
            [
              190,
              125
            ],
            [
              190,
              235
            ],
            [
              150,
              235
            ]
          ]
        ],
        "anchors": [
          [
            90,
            105
          ],
          [
            250,
            105
          ],
          [
            170,
            200
          ]
        ]
      },
      {
        "bar": [
          [
            70,
            290
          ],
          [
            145,
            290
          ]
        ]
      },
      {
        "bar": [
          [
            230,
            280
          ],
          [
            280,
            335
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        5,
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
          230,
          280
        ]
      ],
      [
        6,
        [
          250,
          105
        ]
      ],
      [
        3,
        [
          280,
          335
        ]
      ],
      [
        0,
        [
          70,
          290
        ]
      ],
      [
        4,
        [
          90,
          105
        ]
      ]
    ]
  },
  {
    "packIndex": 4,
    "id": "v7-three-hinges",
    "name": "Three hinges",
    "tip": "Each remaining pivot changes what the next piece can reach.",
    "rationale": "Each remaining pivot changes what the next piece can reach.",
    "pieces": [
      {
        "outline": [
          [
            100,
            80
          ],
          [
            157.5,
            140
          ],
          [
            100,
            200
          ],
          [
            42.5,
            140
          ]
        ],
        "anchors": [
          [
            100,
            110
          ],
          [
            100,
            165
          ]
        ]
      },
      {
        "outline": [
          [
            245,
            102.5
          ],
          [
            305,
            175
          ],
          [
            245,
            247.5
          ],
          [
            185,
            175
          ]
        ],
        "anchors": [
          [
            245,
            130
          ],
          [
            245,
            215
          ]
        ]
      },
      {
        "bar": [
          [
            75,
            300
          ],
          [
            205,
            350
          ]
        ]
      },
      {
        "outline": [
          [
            265,
            310
          ],
          [
            305,
            310
          ],
          [
            305,
            390
          ],
          [
            265,
            390
          ]
        ],
        "anchors": [
          [
            285,
            330
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          100,
          110
        ]
      ],
      [
        3,
        [
          245,
          130
        ]
      ],
      [
        4,
        [
          100,
          165
        ]
      ],
      [
        6,
        [
          245,
          215
        ]
      ],
      [
        5,
        [
          75,
          300
        ]
      ]
    ]
  },
  {
    "packIndex": 4,
    "id": "v7-turning-fork",
    "name": "Turning fork",
    "tip": "Choose when to hinge the low keeper as the fork sweeps through the middle.",
    "rationale": "Choose when to hinge the low keeper as the fork sweeps through the middle.",
    "pieces": [
      {
        "outline": [
          [
            45,
            90
          ],
          [
            290,
            90
          ],
          [
            290,
            130
          ],
          [
            187.5,
            130
          ],
          [
            187.5,
            245
          ],
          [
            147.5,
            245
          ],
          [
            147.5,
            130
          ],
          [
            45,
            130
          ]
        ],
        "components": [
          [
            [
              45,
              90
            ],
            [
              290,
              90
            ],
            [
              290,
              130
            ],
            [
              45,
              130
            ]
          ],
          [
            [
              147.5,
              130
            ],
            [
              187.5,
              130
            ],
            [
              187.5,
              245
            ],
            [
              147.5,
              245
            ]
          ]
        ],
        "anchors": [
          [
            70,
            110
          ],
          [
            265,
            110
          ],
          [
            167,
            210
          ]
        ]
      },
      {
        "outline": [
          [
            50,
            280
          ],
          [
            175,
            280
          ],
          [
            175,
            315
          ],
          [
            85,
            315
          ],
          [
            85,
            385
          ],
          [
            50,
            385
          ]
        ],
        "components": [
          [
            [
              50,
              280
            ],
            [
              175,
              280
            ],
            [
              175,
              315
            ],
            [
              50,
              315
            ]
          ],
          [
            [
              50,
              315
            ],
            [
              85,
              315
            ],
            [
              85,
              385
            ],
            [
              50,
              385
            ]
          ]
        ],
        "anchors": [
          [
            70,
            300
          ],
          [
            150,
            300
          ]
        ]
      },
      {
        "bar": [
          [
            240,
            285
          ],
          [
            295,
            365
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
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
          265,
          110
        ]
      ],
      [
        0,
        [
          70,
          300
        ]
      ],
      [
        5,
        [
          70,
          110
        ]
      ],
      [
        4,
        [
          167,
          210
        ]
      ],
      [
        6,
        [
          240,
          285
        ]
      ]
    ]
  },
  {
    "id": "v6-pocket-lid",
    "name": "Pocket lid",
    "tip": "Tip the lid to reveal a parking hole. Use that space before freeing the shelf.",
    "rationale": "A three-pin tapered lid covers a single board target. Choosing the remaining pivot exposes the pocket while the shelf controls the exit.",
    "pieces": [
      {
        "outline": [
          [
            65,
            100
          ],
          [
            285,
            100
          ],
          [
            240,
            205
          ],
          [
            110,
            205
          ]
        ],
        "anchors": [
          [
            95,
            125
          ],
          [
            255,
            125
          ],
          [
            175,
            180
          ]
        ]
      },
      {
        "bar": [
          [
            100,
            275
          ],
          [
            250,
            275
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [
      [
        95,
        150
      ]
    ],
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
        3,
        [
          95,
          150
        ]
      ],
      [
        1,
        [
          100,
          275
        ]
      ],
      [
        4,
        [
          95,
          125
        ]
      ]
    ]
  },
  {
    "id": "v6-turnstile",
    "name": "Turnstile",
    "tip": "The center paddle hangs on one pin. Open a side before the two arms meet.",
    "rationale": "Two staggered diagonal arms feed a narrow central gate; the one-pin paddle can catch a falling arm. Choosing the first side opens reusable board space.",
    "pieces": [
      {
        "bar": [
          [
            65,
            130
          ],
          [
            145,
            200
          ]
        ]
      },
      {
        "bar": [
          [
            240,
            145
          ],
          [
            295,
            245
          ]
        ]
      },
      {
        "outline": [
          [
            155,
            270
          ],
          [
            195,
            270
          ],
          [
            195,
            375
          ],
          [
            155,
            375
          ]
        ],
        "anchors": [
          [
            175,
            295
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        1,
        [
          240,
          145
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
        4,
        [
          65,
          130
        ]
      ],
      [
        3,
        [
          175,
          295
        ]
      ]
    ]
  },
  {
    "id": "v6-secret-shelf",
    "name": "Secret shelf",
    "tip": "The long step hides a parking hole. Leave room for the hooked end to swing.",
    "rationale": "A stepped shelf bridges two unequal supports. Its covered board target becomes a useful parking pocket as it rotates, while the downturned foot can catch on the right support.",
    "pieces": [
      {
        "outline": [
          [
            55,
            105
          ],
          [
            285,
            105
          ],
          [
            285,
            215
          ],
          [
            245,
            215
          ],
          [
            245,
            150
          ],
          [
            55,
            150
          ]
        ],
        "components": [
          [
            [
              55,
              105
            ],
            [
              285,
              105
            ],
            [
              285,
              150
            ],
            [
              55,
              150
            ]
          ],
          [
            [
              245,
              150
            ],
            [
              285,
              150
            ],
            [
              285,
              215
            ],
            [
              245,
              215
            ]
          ]
        ],
        "anchors": [
          [
            80,
            127
          ],
          [
            260,
            180
          ]
        ]
      },
      {
        "bar": [
          [
            80,
            270
          ],
          [
            160,
            270
          ]
        ]
      },
      {
        "bar": [
          [
            240,
            310
          ],
          [
            300,
            310
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [
      [
        190,
        127
      ]
    ],
    "solution": [
      [
        1,
        [
          245,
          35
        ]
      ],
      [
        0,
        [
          190,
          127
        ]
      ],
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
          260,
          180
        ]
      ],
      [
        3,
        [
          300,
          310
        ]
      ],
      [
        2,
        [
          80,
          127
        ]
      ]
    ]
  },
  {
    "id": "v6-offset-escapement",
    "name": "Offset escapement",
    "tip": "Free a parking space on the left before the heavy shoulder comes down.",
    "rationale": "An asymmetric shoulder plate and diamond fall toward a shared offset shelf. The three-pin shoulder has two useful pivot heights; its wide foot makes the timing of support removal matter.",
    "pieces": [
      {
        "outline": [
          [
            45,
            100
          ],
          [
            175,
            100
          ],
          [
            220,
            150
          ],
          [
            175,
            210
          ],
          [
            45,
            210
          ]
        ],
        "anchors": [
          [
            70,
            125
          ],
          [
            155,
            125
          ],
          [
            90,
            185
          ]
        ]
      },
      {
        "outline": [
          [
            275,
            165
          ],
          [
            325,
            225
          ],
          [
            275,
            285
          ],
          [
            225,
            225
          ]
        ],
        "anchors": [
          [
            275,
            195
          ],
          [
            275,
            250
          ]
        ]
      },
      {
        "bar": [
          [
            95,
            330
          ],
          [
            240,
            330
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        3,
        [
          245,
          35
        ]
      ],
      [
        4,
        [
          275,
          195
        ]
      ],
      [
        6,
        [
          275,
          250
        ]
      ],
      [
        0,
        [
          240,
          330
        ]
      ],
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        1,
        [
          70,
          125
        ]
      ],
      [
        5,
        [
          90,
          185
        ]
      ]
    ]
  },
  {
    "packIndex": 5,
    "id": "v7-covered-pocket",
    "name": "Covered pocket",
    "tip": "One covered board hole sits beneath the square lid; lift the lid to earn it.",
    "rationale": "One covered board hole sits beneath the square lid; lift the lid to earn it.",
    "pieces": [
      {
        "outline": [
          [
            50,
            95
          ],
          [
            140,
            95
          ],
          [
            140,
            190
          ],
          [
            50,
            190
          ]
        ],
        "anchors": [
          [
            70,
            115
          ],
          [
            120,
            165
          ]
        ]
      },
      {
        "bar": [
          [
            200,
            120
          ],
          [
            285,
            170
          ]
        ]
      },
      {
        "bar": [
          [
            80,
            260
          ],
          [
            230,
            260
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [
      [
        95,
        145
      ]
    ],
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
          70,
          115
        ]
      ],
      [
        3,
        [
          200,
          120
        ]
      ],
      [
        4,
        [
          285,
          170
        ]
      ],
      [
        5,
        [
          95,
          145
        ]
      ]
    ]
  },
  {
    "packIndex": 5,
    "id": "v7-window-shutter",
    "name": "Window shutter",
    "tip": "The tall shutter hides one useful opening; choose when to reveal it.",
    "rationale": "The tall shutter hides one useful opening; choose when to reveal it.",
    "pieces": [
      {
        "outline": [
          [
            70,
            90
          ],
          [
            135,
            90
          ],
          [
            135,
            250
          ],
          [
            70,
            250
          ]
        ],
        "anchors": [
          [
            90,
            110
          ],
          [
            115,
            230
          ]
        ]
      },
      {
        "outline": [
          [
            240,
            90
          ],
          [
            295,
            150
          ],
          [
            240,
            210
          ],
          [
            185,
            150
          ]
        ],
        "anchors": [
          [
            240,
            125
          ],
          [
            240,
            180
          ]
        ]
      },
      {
        "bar": [
          [
            65,
            315
          ],
          [
            270,
            315
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [
      [
        102,
        170
      ]
    ],
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
        3,
        [
          90,
          110
        ]
      ],
      [
        1,
        [
          240,
          125
        ]
      ],
      [
        4,
        [
          102,
          170
        ]
      ],
      [
        5,
        [
          240,
          180
        ]
      ]
    ]
  },
  {
    "packIndex": 5,
    "id": "v7-small-vault",
    "name": "Small vault",
    "tip": "Two pins fix the cap. Choose the last hinge so a mounting hole opens before you need the next parking space.",
    "rationale": "Two pins fix the cap. Choose the last hinge so a mounting hole opens before you need the next parking space.",
    "pieces": [
      {
        "outline": [
          [
            55,
            95
          ],
          [
            290,
            95
          ],
          [
            290,
            150
          ],
          [
            55,
            150
          ]
        ],
        "anchors": [
          [
            80,
            120
          ],
          [
            170,
            120
          ],
          [
            265,
            120
          ]
        ]
      },
      {
        "outline": [
          [
            70,
            200
          ],
          [
            200,
            200
          ],
          [
            200,
            235
          ],
          [
            105,
            235
          ],
          [
            105,
            345
          ],
          [
            70,
            345
          ]
        ],
        "components": [
          [
            [
              70,
              200
            ],
            [
              200,
              200
            ],
            [
              200,
              235
            ],
            [
              70,
              235
            ]
          ],
          [
            [
              70,
              235
            ],
            [
              105,
              235
            ],
            [
              105,
              345
            ],
            [
              70,
              345
            ]
          ]
        ],
        "anchors": [
          [
            90,
            220
          ],
          [
            90,
            320
          ]
        ]
      },
      {
        "outline": [
          [
            245,
            205
          ],
          [
            290,
            205
          ],
          [
            290,
            310
          ],
          [
            245,
            310
          ]
        ],
        "anchors": [
          [
            267,
            230
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          80,
          120
        ]
      ],
      [
        3,
        [
          170,
          120
        ]
      ],
      [
        5,
        [
          265,
          120
        ]
      ],
      [
        4,
        [
          90,
          220
        ]
      ]
    ]
  },
  {
    "packIndex": 5,
    "id": "v7-one-key-two-doors",
    "name": "One key, two doors",
    "tip": "The small key opens a route between two gates; use its hole deliberately.",
    "rationale": "The small key opens a route between two gates; use its hole deliberately.",
    "pieces": [
      {
        "bar": [
          [
            60,
            125
          ],
          [
            145,
            185
          ]
        ]
      },
      {
        "bar": [
          [
            230,
            115
          ],
          [
            290,
            210
          ]
        ]
      },
      {
        "outline": [
          [
            155,
            240
          ],
          [
            195,
            240
          ],
          [
            195,
            325
          ],
          [
            155,
            325
          ]
        ],
        "anchors": [
          [
            175,
            260
          ]
        ]
      },
      {
        "bar": [
          [
            80,
            365
          ],
          [
            265,
            365
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          230,
          115
        ]
      ],
      [
        3,
        [
          60,
          125
        ]
      ],
      [
        4,
        [
          145,
          185
        ]
      ],
      [
        5,
        [
          290,
          210
        ]
      ],
      [
        6,
        [
          175,
          260
        ]
      ]
    ]
  },
  {
    "packIndex": 5,
    "id": "v7-high-window",
    "name": "High shoulder",
    "tip": "The broad panel needs a free side before its third pin can be reused.",
    "rationale": "The broad panel needs a free side before its third pin can be reused.",
    "pieces": [
      {
        "outline": [
          [
            65,
            90
          ],
          [
            270,
            90
          ],
          [
            270,
            190
          ],
          [
            65,
            190
          ]
        ],
        "anchors": [
          [
            90,
            115
          ],
          [
            245,
            115
          ],
          [
            170,
            165
          ]
        ]
      },
      {
        "bar": [
          [
            70,
            260
          ],
          [
            150,
            300
          ]
        ]
      },
      {
        "outline": [
          [
            220,
            250
          ],
          [
            305,
            250
          ],
          [
            305,
            285
          ],
          [
            255,
            285
          ],
          [
            255,
            380
          ],
          [
            220,
            380
          ]
        ],
        "components": [
          [
            [
              220,
              250
            ],
            [
              305,
              250
            ],
            [
              305,
              285
            ],
            [
              220,
              285
            ]
          ],
          [
            [
              220,
              285
            ],
            [
              255,
              285
            ],
            [
              255,
              380
            ],
            [
              220,
              380
            ]
          ]
        ],
        "anchors": [
          [
            240,
            270
          ],
          [
            240,
            355
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        3,
        [
          105,
          35
        ]
      ],
      [
        6,
        [
          245,
          35
        ]
      ],
      [
        5,
        [
          70,
          260
        ]
      ],
      [
        2,
        [
          240,
          270
        ]
      ],
      [
        0,
        [
          240,
          355
        ]
      ],
      [
        1,
        [
          90,
          115
        ]
      ],
      [
        4,
        [
          245,
          115
        ]
      ]
    ]
  },
  {
    "packIndex": 5,
    "id": "v7-side-door",
    "name": "Side door",
    "tip": "Free a side passage before the broad shoulder falls across the lower openings.",
    "rationale": "Free a side passage before the broad shoulder falls across the lower openings.",
    "pieces": [
      {
        "outline": [
          [
            45,
            90
          ],
          [
            220,
            90
          ],
          [
            285,
            150
          ],
          [
            220,
            205
          ],
          [
            45,
            205
          ]
        ],
        "anchors": [
          [
            70,
            115
          ],
          [
            190,
            115
          ],
          [
            245,
            150
          ]
        ]
      },
      {
        "outline": [
          [
            55,
            255
          ],
          [
            100,
            255
          ],
          [
            100,
            370
          ],
          [
            55,
            370
          ]
        ],
        "anchors": [
          [
            77,
            280
          ]
        ]
      },
      {
        "bar": [
          [
            165,
            280
          ],
          [
            285,
            335
          ]
        ]
      },
      {
        "outline": [
          [
            110,
            220
          ],
          [
            140,
            220
          ],
          [
            140,
            260
          ],
          [
            110,
            260
          ]
        ],
        "anchors": [
          [
            125,
            240
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        3,
        [
          245,
          35
        ]
      ],
      [
        5,
        [
          77,
          280
        ]
      ],
      [
        6,
        [
          285,
          335
        ]
      ],
      [
        1,
        [
          125,
          240
        ]
      ],
      [
        0,
        [
          190,
          115
        ]
      ],
      [
        4,
        [
          70,
          115
        ]
      ]
    ]
  },
  {
    "id": "v6-cantilever-cargo",
    "name": "Cantilever cargo",
    "tip": "The wide load needs a path past the short post. Which shelf end should drop?",
    "rationale": "An off-center trapezoid lands on a long shelf; a one-pin post blocks one exit while a lower stop can catch the load.",
    "pieces": [
      {
        "outline": [
          [
            90,
            95
          ],
          [
            230,
            95
          ],
          [
            260,
            165
          ],
          [
            60,
            165
          ]
        ],
        "anchors": [
          [
            110,
            120
          ],
          [
            210,
            120
          ]
        ]
      },
      {
        "bar": [
          [
            65,
            235
          ],
          [
            260,
            235
          ]
        ]
      },
      {
        "outline": [
          [
            285,
            170
          ],
          [
            315,
            170
          ],
          [
            315,
            290
          ],
          [
            285,
            290
          ]
        ],
        "anchors": [
          [
            300,
            195
          ]
        ]
      },
      {
        "outline": [
          [
            90,
            325
          ],
          [
            195,
            325
          ],
          [
            195,
            355
          ],
          [
            90,
            355
          ]
        ],
        "anchors": [
          [
            120,
            340
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
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
          105,
          35
        ]
      ],
      [
        3,
        [
          210,
          120
        ]
      ],
      [
        0,
        [
          300,
          195
        ]
      ],
      [
        2,
        [
          110,
          120
        ]
      ],
      [
        5,
        [
          260,
          235
        ]
      ]
    ]
  },
  {
    "id": "v6-stair-descent",
    "name": "Stair descent",
    "tip": "The ramps share the exit. Free a landing before dropping the hexagon.",
    "rationale": "A compact hexagon falls onto alternating diagonal ramps. Opening the lower landing changes where the upper ramp can slide the load.",
    "pieces": [
      {
        "outline": [
          [
            100,
            85
          ],
          [
            190,
            85
          ],
          [
            215,
            125
          ],
          [
            190,
            165
          ],
          [
            100,
            165
          ],
          [
            75,
            125
          ]
        ],
        "anchors": [
          [
            115,
            115
          ],
          [
            175,
            135
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            210
          ],
          [
            220,
            250
          ]
        ]
      },
      {
        "bar": [
          [
            150,
            325
          ],
          [
            300,
            290
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
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
          55,
          210
        ]
      ],
      [
        4,
        [
          175,
          135
        ]
      ],
      [
        5,
        [
          220,
          250
        ]
      ],
      [
        0,
        [
          300,
          290
        ]
      ]
    ]
  },
  {
    "id": "v6-split-trestle",
    "name": "Split trestle",
    "tip": "The bridge is broad; its two supports do not release the same way.",
    "rationale": "A three-pin broad beam is supported by an angled leg and a single-pin triangular trestle. The last beam pivot and which support remains decide the catch.",
    "pieces": [
      {
        "outline": [
          [
            55,
            95
          ],
          [
            280,
            95
          ],
          [
            280,
            150
          ],
          [
            220,
            175
          ],
          [
            80,
            175
          ],
          [
            55,
            150
          ]
        ],
        "anchors": [
          [
            85,
            120
          ],
          [
            250,
            120
          ],
          [
            170,
            150
          ]
        ]
      },
      {
        "bar": [
          [
            70,
            245
          ],
          [
            140,
            285
          ]
        ]
      },
      {
        "outline": [
          [
            205,
            240
          ],
          [
            300,
            240
          ],
          [
            250,
            335
          ]
        ],
        "anchors": [
          [
            250,
            265
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        2,
        [
          245,
          35
        ]
      ],
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
          85,
          120
        ]
      ],
      [
        5,
        [
          250,
          120
        ]
      ],
      [
        4,
        [
          170,
          150
        ]
      ],
      [
        3,
        [
          250,
          265
        ]
      ]
    ]
  },
  {
    "id": "v6-fork-lift",
    "name": "Fork lift",
    "tip": "The fork can scoop the bar. Keep its open side clear before lifting a pin.",
    "rationale": "A concave fork turns as one body around a choice of three pins. A loose diagonal beam can nest inside it, while the two-pin gate changes the available exit.",
    "pieces": [
      {
        "outline": [
          [
            45,
            185
          ],
          [
            85,
            185
          ],
          [
            85,
            290
          ],
          [
            235,
            290
          ],
          [
            235,
            250
          ],
          [
            275,
            250
          ],
          [
            275,
            330
          ],
          [
            45,
            330
          ]
        ],
        "components": [
          [
            [
              45,
              185
            ],
            [
              85,
              185
            ],
            [
              85,
              290
            ],
            [
              45,
              290
            ]
          ],
          [
            [
              45,
              290
            ],
            [
              275,
              290
            ],
            [
              275,
              330
            ],
            [
              45,
              330
            ]
          ],
          [
            [
              235,
              250
            ],
            [
              275,
              250
            ],
            [
              275,
              290
            ],
            [
              235,
              290
            ]
          ]
        ],
        "anchors": [
          [
            65,
            210
          ],
          [
            100,
            310
          ],
          [
            255,
            310
          ]
        ]
      },
      {
        "bar": [
          [
            125,
            130
          ],
          [
            230,
            175
          ]
        ]
      },
      {
        "outline": [
          [
            295,
            260
          ],
          [
            325,
            260
          ],
          [
            325,
            365
          ],
          [
            295,
            365
          ]
        ],
        "anchors": [
          [
            310,
            290
          ],
          [
            310,
            340
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        4,
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
          230,
          175
        ]
      ],
      [
        5,
        [
          100,
          310
        ]
      ],
      [
        6,
        [
          310,
          290
        ]
      ],
      [
        3,
        [
          255,
          310
        ]
      ],
      [
        0,
        [
          310,
          340
        ]
      ]
    ]
  },
  {
    "packIndex": 6,
    "id": "v7-shelf-and-sail",
    "name": "Shelf and sail",
    "tip": "The triangular load can sit on the shelf; removing its screws alone is not enough.",
    "rationale": "The triangular load can sit on the shelf; removing its screws alone is not enough.",
    "pieces": [
      {
        "outline": [
          [
            80,
            210
          ],
          [
            175,
            80
          ],
          [
            270,
            210
          ]
        ],
        "anchors": [
          [
            175,
            120
          ],
          [
            125,
            180
          ],
          [
            225,
            180
          ]
        ]
      },
      {
        "bar": [
          [
            65,
            260
          ],
          [
            285,
            260
          ]
        ]
      },
      {
        "bar": [
          [
            100,
            350
          ],
          [
            245,
            350
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        0,
        [
          105,
          35
        ]
      ],
      [
        3,
        [
          245,
          35
        ]
      ],
      [
        1,
        [
          65,
          260
        ]
      ],
      [
        2,
        [
          175,
          120
        ]
      ],
      [
        4,
        [
          125,
          180
        ]
      ],
      [
        5,
        [
          225,
          180
        ]
      ],
      [
        6,
        [
          285,
          260
        ]
      ]
    ]
  },
  {
    "packIndex": 6,
    "id": "v7-two-storeys",
    "name": "Two storeys",
    "tip": "Release a way through both floors, not just the upper landing.",
    "rationale": "Release a way through both floors, not just the upper landing.",
    "pieces": [
      {
        "bar": [
          [
            75,
            100
          ],
          [
            265,
            100
          ]
        ]
      },
      {
        "outline": [
          [
            50,
            175
          ],
          [
            170,
            175
          ],
          [
            170,
            210
          ],
          [
            85,
            210
          ],
          [
            85,
            275
          ],
          [
            50,
            275
          ]
        ],
        "components": [
          [
            [
              50,
              175
            ],
            [
              170,
              175
            ],
            [
              170,
              210
            ],
            [
              50,
              210
            ]
          ],
          [
            [
              50,
              210
            ],
            [
              85,
              210
            ],
            [
              85,
              275
            ],
            [
              50,
              275
            ]
          ]
        ],
        "anchors": [
          [
            70,
            195
          ],
          [
            145,
            195
          ]
        ]
      },
      {
        "outline": [
          [
            225,
            175
          ],
          [
            290,
            175
          ],
          [
            290,
            275
          ],
          [
            225,
            275
          ]
        ],
        "anchors": [
          [
            245,
            195
          ],
          [
            270,
            255
          ]
        ]
      },
      {
        "bar": [
          [
            80,
            340
          ],
          [
            265,
            340
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          75,
          100
        ]
      ],
      [
        3,
        [
          70,
          195
        ]
      ],
      [
        5,
        [
          265,
          100
        ]
      ],
      [
        6,
        [
          145,
          195
        ]
      ],
      [
        7,
        [
          80,
          340
        ]
      ],
      [
        4,
        [
          265,
          340
        ]
      ]
    ]
  },
  {
    "packIndex": 6,
    "id": "v7-diagonal-chute",
    "name": "Diagonal chute",
    "tip": "The diagonal guide redirects the load toward the lower gate.",
    "rationale": "The diagonal guide redirects the load toward the lower gate.",
    "pieces": [
      {
        "outline": [
          [
            115,
            85
          ],
          [
            185,
            135
          ],
          [
            115,
            185
          ],
          [
            45,
            135
          ]
        ],
        "anchors": [
          [
            85,
            135
          ],
          [
            145,
            135
          ]
        ]
      },
      {
        "bar": [
          [
            215,
            180
          ],
          [
            275,
            285
          ]
        ]
      },
      {
        "bar": [
          [
            65,
            260
          ],
          [
            165,
            315
          ]
        ]
      },
      {
        "outline": [
          [
            220,
            350
          ],
          [
            310,
            350
          ],
          [
            310,
            385
          ],
          [
            220,
            385
          ]
        ],
        "anchors": [
          [
            240,
            367
          ],
          [
            290,
            367
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          85,
          135
        ]
      ],
      [
        4,
        [
          145,
          135
        ]
      ],
      [
        3,
        [
          215,
          180
        ]
      ],
      [
        5,
        [
          65,
          260
        ]
      ],
      [
        6,
        [
          275,
          285
        ]
      ],
      [
        7,
        [
          165,
          315
        ]
      ]
    ]
  },
  {
    "packIndex": 6,
    "id": "v7-bridge-pier",
    "name": "Bridge pier",
    "tip": "The central pier holds the bridge up after its pins are gone.",
    "rationale": "The central pier holds the bridge up after its pins are gone.",
    "pieces": [
      {
        "outline": [
          [
            65,
            90
          ],
          [
            285,
            90
          ],
          [
            285,
            140
          ],
          [
            65,
            140
          ]
        ],
        "anchors": [
          [
            90,
            115
          ],
          [
            260,
            115
          ]
        ]
      },
      {
        "outline": [
          [
            155,
            195
          ],
          [
            195,
            195
          ],
          [
            195,
            315
          ],
          [
            155,
            315
          ]
        ],
        "anchors": [
          [
            175,
            215
          ]
        ]
      },
      {
        "bar": [
          [
            65,
            335
          ],
          [
            120,
            335
          ]
        ]
      },
      {
        "bar": [
          [
            230,
            345
          ],
          [
            290,
            345
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          90,
          115
        ]
      ],
      [
        3,
        [
          260,
          115
        ]
      ],
      [
        4,
        [
          175,
          215
        ]
      ],
      [
        5,
        [
          65,
          335
        ]
      ],
      [
        6,
        [
          120,
          335
        ]
      ]
    ]
  },
  {
    "packIndex": 6,
    "id": "v7-stepped-load",
    "name": "Stepped load",
    "tip": "The upper elbow can rest on either step; choose which support to remove first.",
    "rationale": "The upper elbow can rest on either step; choose which support to remove first.",
    "pieces": [
      {
        "outline": [
          [
            65,
            85
          ],
          [
            275,
            85
          ],
          [
            275,
            125
          ],
          [
            105,
            125
          ],
          [
            105,
            230
          ],
          [
            65,
            230
          ]
        ],
        "components": [
          [
            [
              65,
              85
            ],
            [
              275,
              85
            ],
            [
              275,
              125
            ],
            [
              65,
              125
            ]
          ],
          [
            [
              65,
              125
            ],
            [
              105,
              125
            ],
            [
              105,
              230
            ],
            [
              65,
              230
            ]
          ]
        ],
        "anchors": [
          [
            90,
            105
          ],
          [
            250,
            105
          ],
          [
            85,
            205
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            290
          ],
          [
            135,
            290
          ]
        ]
      },
      {
        "bar": [
          [
            205,
            340
          ],
          [
            290,
            340
          ]
        ]
      },
      {
        "outline": [
          [
            245,
            255
          ],
          [
            285,
            255
          ],
          [
            285,
            295
          ],
          [
            245,
            295
          ]
        ],
        "anchors": [
          [
            265,
            275
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          90,
          105
        ]
      ],
      [
        3,
        [
          250,
          105
        ]
      ],
      [
        7,
        [
          85,
          205
        ]
      ],
      [
        4,
        [
          55,
          290
        ]
      ],
      [
        5,
        [
          135,
          290
        ]
      ],
      [
        6,
        [
          265,
          275
        ]
      ]
    ]
  },
  {
    "packIndex": 6,
    "id": "v7-three-floor-release",
    "name": "Three-floor release",
    "tip": "Trace the route to the bottom before dropping the heavy top plate.",
    "rationale": "Trace the route to the bottom before dropping the heavy top plate.",
    "pieces": [
      {
        "outline": [
          [
            90,
            85
          ],
          [
            260,
            85
          ],
          [
            260,
            145
          ],
          [
            90,
            145
          ]
        ],
        "anchors": [
          [
            115,
            110
          ],
          [
            235,
            110
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            205
          ],
          [
            155,
            205
          ]
        ]
      },
      {
        "bar": [
          [
            225,
            255
          ],
          [
            295,
            255
          ]
        ]
      },
      {
        "bar": [
          [
            90,
            340
          ],
          [
            250,
            340
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          110
        ]
      ],
      [
        3,
        [
          235,
          110
        ]
      ],
      [
        4,
        [
          55,
          205
        ]
      ],
      [
        5,
        [
          225,
          255
        ]
      ],
      [
        6,
        [
          155,
          205
        ]
      ],
      [
        7,
        [
          295,
          255
        ]
      ]
    ]
  },
  {
    "id": "v6-suspended-switch",
    "name": "Suspended switch",
    "tip": "One small latch holds the center. Keep somewhere to park its screw after the broad arms move.",
    "rationale": "Two asymmetric pentagonal arms, a one-pin center latch and a lower beam share a landing zone. The latch can catch released arms; removing the beam too early trades useful support for crowded parking.",
    "pieces": [
      {
        "outline": [
          [
            25,
            105
          ],
          [
            130,
            85
          ],
          [
            155,
            145
          ],
          [
            125,
            205
          ],
          [
            35,
            185
          ]
        ],
        "anchors": [
          [
            55,
            130
          ],
          [
            120,
            155
          ]
        ]
      },
      {
        "outline": [
          [
            195,
            95
          ],
          [
            305,
            115
          ],
          [
            320,
            180
          ],
          [
            245,
            230
          ],
          [
            190,
            165
          ]
        ],
        "anchors": [
          [
            220,
            125
          ],
          [
            285,
            165
          ]
        ]
      },
      {
        "outline": [
          [
            160,
            205
          ],
          [
            190,
            205
          ],
          [
            190,
            315
          ],
          [
            160,
            315
          ]
        ],
        "anchors": [
          [
            175,
            230
          ]
        ]
      },
      {
        "bar": [
          [
            75,
            365
          ],
          [
            280,
            365
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        1,
        [
          245,
          35
        ]
      ],
      [
        6,
        [
          105,
          35
        ]
      ],
      [
        3,
        [
          280,
          365
        ]
      ],
      [
        5,
        [
          120,
          155
        ]
      ],
      [
        4,
        [
          75,
          365
        ]
      ],
      [
        0,
        [
          175,
          230
        ]
      ],
      [
        2,
        [
          55,
          130
        ]
      ]
    ]
  },
  {
    "id": "v6-arrow-lock",
    "name": "Arrow lock",
    "tip": "The arrow is wider than the exit between the stops. Open a side before choosing its last pin.",
    "rationale": "A three-pin arrowhead meets two uneven pivoting stops and a one-pin hanging latch. The stops share its exit, so freeing parking and opening a side are different decisions.",
    "pieces": [
      {
        "outline": [
          [
            80,
            90
          ],
          [
            215,
            90
          ],
          [
            215,
            65
          ],
          [
            290,
            140
          ],
          [
            215,
            215
          ],
          [
            215,
            190
          ],
          [
            80,
            190
          ]
        ],
        "components": [
          [
            [
              80,
              90
            ],
            [
              215,
              90
            ],
            [
              215,
              190
            ],
            [
              80,
              190
            ]
          ],
          [
            [
              215,
              65
            ],
            [
              290,
              140
            ],
            [
              215,
              215
            ]
          ]
        ],
        "anchors": [
          [
            105,
            115
          ],
          [
            190,
            165
          ],
          [
            245,
            140
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            265
          ],
          [
            135,
            265
          ]
        ]
      },
      {
        "bar": [
          [
            235,
            280
          ],
          [
            305,
            280
          ]
        ]
      },
      {
        "outline": [
          [
            165,
            245
          ],
          [
            195,
            245
          ],
          [
            195,
            355
          ],
          [
            165,
            355
          ]
        ],
        "anchors": [
          [
            180,
            270
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        7,
        [
          245,
          35
        ]
      ],
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        1,
        [
          180,
          270
        ]
      ],
      [
        0,
        [
          245,
          140
        ]
      ],
      [
        3,
        [
          105,
          115
        ]
      ],
      [
        5,
        [
          190,
          165
        ]
      ],
      [
        4,
        [
          235,
          280
        ]
      ],
      [
        6,
        [
          135,
          265
        ]
      ]
    ]
  },
  {
    "id": "v6-cornerstone",
    "name": "Cornerstone",
    "tip": "The wide corner piece can swing around three different pins. Watch the shelf under its long foot.",
    "rationale": "A broad right-angle corner carries a weighted foot above a slanted shelf, a short side gate and a one-pin stopper. Its concave opening and three anchor choices determine where it can pass.",
    "pieces": [
      {
        "outline": [
          [
            55,
            85
          ],
          [
            105,
            85
          ],
          [
            105,
            185
          ],
          [
            265,
            185
          ],
          [
            265,
            235
          ],
          [
            55,
            235
          ]
        ],
        "components": [
          [
            [
              55,
              85
            ],
            [
              105,
              85
            ],
            [
              105,
              185
            ],
            [
              55,
              185
            ]
          ],
          [
            [
              55,
              185
            ],
            [
              265,
              185
            ],
            [
              265,
              235
            ],
            [
              55,
              235
            ]
          ]
        ],
        "anchors": [
          [
            80,
            115
          ],
          [
            80,
            210
          ],
          [
            230,
            210
          ]
        ]
      },
      {
        "bar": [
          [
            100,
            295
          ],
          [
            230,
            325
          ]
        ]
      },
      {
        "bar": [
          [
            300,
            260
          ],
          [
            300,
            355
          ]
        ]
      },
      {
        "outline": [
          [
            30,
            285
          ],
          [
            60,
            285
          ],
          [
            60,
            375
          ],
          [
            30,
            375
          ]
        ],
        "anchors": [
          [
            45,
            310
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        0,
        [
          245,
          35
        ]
      ],
      [
        2,
        [
          105,
          35
        ]
      ],
      [
        7,
        [
          230,
          210
        ]
      ],
      [
        4,
        [
          45,
          310
        ]
      ],
      [
        5,
        [
          80,
          115
        ]
      ],
      [
        3,
        [
          300,
          260
        ]
      ],
      [
        6,
        [
          230,
          325
        ]
      ],
      [
        1,
        [
          300,
          355
        ]
      ]
    ]
  },
  {
    "id": "v6-final-turn",
    "name": "Final turn",
    "tip": "Two three-pin shapes share the lower stop. Make a route for one before loosening both.",
    "rationale": "A triangle and a broad pentagon have six total anchor choices over one central lower stop. Releasing both into the shared stop can bury useful mounting holes; free a side, preserve parking, then finish the remaining body.",
    "pieces": [
      {
        "outline": [
          [
            25,
            90
          ],
          [
            150,
            90
          ],
          [
            90,
            245
          ]
        ],
        "anchors": [
          [
            55,
            115
          ],
          [
            120,
            115
          ],
          [
            90,
            195
          ]
        ]
      },
      {
        "outline": [
          [
            205,
            90
          ],
          [
            305,
            90
          ],
          [
            330,
            150
          ],
          [
            275,
            245
          ],
          [
            180,
            150
          ]
        ],
        "anchors": [
          [
            220,
            115
          ],
          [
            290,
            115
          ],
          [
            270,
            195
          ]
        ]
      },
      {
        "bar": [
          [
            90,
            315
          ],
          [
            265,
            315
          ]
        ]
      },
      {
        "outline": [
          [
            155,
            220
          ],
          [
            185,
            220
          ],
          [
            185,
            285
          ],
          [
            155,
            285
          ]
        ],
        "anchors": [
          [
            170,
            245
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        8,
        [
          245,
          35
        ]
      ],
      [
        7,
        [
          105,
          35
        ]
      ],
      [
        0,
        [
          265,
          315
        ]
      ],
      [
        2,
        [
          170,
          245
        ]
      ],
      [
        1,
        [
          55,
          115
        ]
      ],
      [
        3,
        [
          90,
          195
        ]
      ],
      [
        6,
        [
          120,
          115
        ]
      ],
      [
        5,
        [
          90,
          315
        ]
      ],
      [
        4,
        [
          220,
          115
        ]
      ]
    ]
  },
  {
    "packIndex": 7,
    "id": "v7-split-lock",
    "name": "Split lock",
    "tip": "The split key has to turn past two independent catches.",
    "rationale": "The split key has to turn past two independent catches.",
    "pieces": [
      {
        "outline": [
          [
            55,
            90
          ],
          [
            295,
            90
          ],
          [
            295,
            130
          ],
          [
            195,
            130
          ],
          [
            195,
            235
          ],
          [
            155,
            235
          ],
          [
            155,
            130
          ],
          [
            55,
            130
          ]
        ],
        "components": [
          [
            [
              55,
              90
            ],
            [
              295,
              90
            ],
            [
              295,
              130
            ],
            [
              55,
              130
            ]
          ],
          [
            [
              155,
              130
            ],
            [
              195,
              130
            ],
            [
              195,
              235
            ],
            [
              155,
              235
            ]
          ]
        ],
        "anchors": [
          [
            80,
            110
          ],
          [
            270,
            110
          ],
          [
            175,
            200
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            280
          ],
          [
            120,
            325
          ]
        ]
      },
      {
        "bar": [
          [
            240,
            300
          ],
          [
            290,
            300
          ]
        ]
      },
      {
        "outline": [
          [
            160,
            310
          ],
          [
            195,
            310
          ],
          [
            195,
            375
          ],
          [
            160,
            375
          ]
        ],
        "anchors": [
          [
            177,
            330
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          80,
          110
        ]
      ],
      [
        3,
        [
          270,
          110
        ]
      ],
      [
        5,
        [
          175,
          200
        ]
      ],
      [
        6,
        [
          55,
          280
        ]
      ],
      [
        4,
        [
          240,
          300
        ]
      ],
      [
        7,
        [
          290,
          300
        ]
      ]
    ]
  },
  {
    "packIndex": 7,
    "id": "v7-crown-and-key",
    "name": "Crown and key",
    "tip": "Use the small key before committing the crown to a side.",
    "rationale": "Use the small key before committing the crown to a side.",
    "pieces": [
      {
        "outline": [
          [
            55,
            120
          ],
          [
            100,
            85
          ],
          [
            245,
            85
          ],
          [
            295,
            120
          ],
          [
            270,
            190
          ],
          [
            80,
            190
          ]
        ],
        "anchors": [
          [
            100,
            160
          ],
          [
            175,
            140
          ],
          [
            250,
            160
          ]
        ]
      },
      {
        "outline": [
          [
            160,
            240
          ],
          [
            195,
            240
          ],
          [
            195,
            305
          ],
          [
            160,
            305
          ]
        ],
        "anchors": [
          [
            177,
            260
          ]
        ]
      },
      {
        "bar": [
          [
            65,
            335
          ],
          [
            125,
            335
          ]
        ]
      },
      {
        "bar": [
          [
            230,
            350
          ],
          [
            290,
            350
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        1,
        [
          105,
          35
        ]
      ],
      [
        3,
        [
          245,
          35
        ]
      ],
      [
        2,
        [
          177,
          260
        ]
      ],
      [
        5,
        [
          250,
          160
        ]
      ],
      [
        0,
        [
          125,
          335
        ]
      ],
      [
        7,
        [
          175,
          140
        ]
      ],
      [
        4,
        [
          100,
          160
        ]
      ],
      [
        6,
        [
          65,
          335
        ]
      ]
    ]
  },
  {
    "packIndex": 7,
    "id": "v7-double-crossing",
    "name": "Double crossing",
    "tip": "The two offset crosses must pass the lower catch in separate turns.",
    "rationale": "The two offset crosses must pass the lower catch in separate turns.",
    "pieces": [
      {
        "outline": [
          [
            40,
            90
          ],
          [
            170,
            90
          ],
          [
            170,
            125
          ],
          [
            122.5,
            125
          ],
          [
            122.5,
            225
          ],
          [
            87.5,
            225
          ],
          [
            87.5,
            125
          ],
          [
            40,
            125
          ]
        ],
        "components": [
          [
            [
              40,
              90
            ],
            [
              170,
              90
            ],
            [
              170,
              125
            ],
            [
              40,
              125
            ]
          ],
          [
            [
              87.5,
              125
            ],
            [
              122.5,
              125
            ],
            [
              122.5,
              225
            ],
            [
              87.5,
              225
            ]
          ]
        ],
        "anchors": [
          [
            65,
            107
          ],
          [
            145,
            107
          ],
          [
            105,
            200
          ]
        ]
      },
      {
        "outline": [
          [
            200,
            180
          ],
          [
            310,
            180
          ],
          [
            310,
            215
          ],
          [
            272.5,
            215
          ],
          [
            272.5,
            310
          ],
          [
            237.5,
            310
          ],
          [
            237.5,
            215
          ],
          [
            200,
            215
          ]
        ],
        "components": [
          [
            [
              200,
              180
            ],
            [
              310,
              180
            ],
            [
              310,
              215
            ],
            [
              200,
              215
            ]
          ],
          [
            [
              237.5,
              215
            ],
            [
              272.5,
              215
            ],
            [
              272.5,
              310
            ],
            [
              237.5,
              310
            ]
          ]
        ],
        "anchors": [
          [
            220,
            197
          ],
          [
            290,
            197
          ],
          [
            255,
            285
          ]
        ]
      },
      {
        "bar": [
          [
            90,
            355
          ],
          [
            230,
            355
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          65,
          107
        ]
      ],
      [
        6,
        [
          145,
          107
        ]
      ],
      [
        3,
        [
          105,
          200
        ]
      ],
      [
        4,
        [
          90,
          355
        ]
      ],
      [
        5,
        [
          220,
          197
        ]
      ],
      [
        7,
        [
          290,
          197
        ]
      ]
    ]
  },
  {
    "packIndex": 7,
    "id": "v7-nested-corners",
    "name": "Nested corners",
    "tip": "The corners are staggered, not stacked; each release changes the next landing.",
    "rationale": "The corners are staggered, not stacked; each release changes the next landing.",
    "pieces": [
      {
        "outline": [
          [
            45,
            85
          ],
          [
            225,
            85
          ],
          [
            225,
            120
          ],
          [
            80,
            120
          ],
          [
            80,
            210
          ],
          [
            45,
            210
          ]
        ],
        "components": [
          [
            [
              45,
              85
            ],
            [
              225,
              85
            ],
            [
              225,
              120
            ],
            [
              45,
              120
            ]
          ],
          [
            [
              45,
              120
            ],
            [
              80,
              120
            ],
            [
              80,
              210
            ],
            [
              45,
              210
            ]
          ]
        ],
        "anchors": [
          [
            65,
            105
          ],
          [
            200,
            105
          ]
        ]
      },
      {
        "outline": [
          [
            130,
            235
          ],
          [
            300,
            235
          ],
          [
            300,
            270
          ],
          [
            165,
            270
          ],
          [
            165,
            365
          ],
          [
            130,
            365
          ]
        ],
        "components": [
          [
            [
              130,
              235
            ],
            [
              300,
              235
            ],
            [
              300,
              270
            ],
            [
              130,
              270
            ]
          ],
          [
            [
              130,
              270
            ],
            [
              165,
              270
            ],
            [
              165,
              365
            ],
            [
              130,
              365
            ]
          ]
        ],
        "anchors": [
          [
            150,
            255
          ],
          [
            275,
            255
          ],
          [
            150,
            340
          ]
        ]
      },
      {
        "bar": [
          [
            260,
            90
          ],
          [
            290,
            180
          ]
        ]
      },
      {
        "outline": [
          [
            45,
            275
          ],
          [
            85,
            275
          ],
          [
            85,
            365
          ],
          [
            45,
            365
          ]
        ],
        "anchors": [
          [
            65,
            295
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        5,
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
          65,
          105
        ]
      ],
      [
        7,
        [
          260,
          90
        ]
      ],
      [
        6,
        [
          200,
          105
        ]
      ],
      [
        2,
        [
          290,
          180
        ]
      ],
      [
        3,
        [
          65,
          295
        ]
      ],
      [
        4,
        [
          150,
          255
        ]
      ]
    ]
  },
  {
    "packIndex": 7,
    "id": "v7-long-way-round",
    "name": "Long way round",
    "tip": "The long arm cannot pass straight down through both short gates.",
    "rationale": "The long arm cannot pass straight down through both short gates.",
    "pieces": [
      {
        "bar": [
          [
            75,
            100
          ],
          [
            265,
            180
          ]
        ]
      },
      {
        "outline": [
          [
            50,
            245
          ],
          [
            150,
            245
          ],
          [
            150,
            285
          ],
          [
            50,
            285
          ]
        ],
        "anchors": [
          [
            70,
            265
          ],
          [
            130,
            265
          ]
        ]
      },
      {
        "outline": [
          [
            220,
            280
          ],
          [
            305,
            280
          ],
          [
            305,
            320
          ],
          [
            220,
            320
          ]
        ],
        "anchors": [
          [
            240,
            300
          ],
          [
            285,
            300
          ]
        ]
      },
      {
        "outline": [
          [
            110,
            350
          ],
          [
            240,
            350
          ],
          [
            240,
            380
          ],
          [
            190,
            380
          ],
          [
            190,
            415
          ],
          [
            160,
            415
          ],
          [
            160,
            380
          ],
          [
            110,
            380
          ]
        ],
        "components": [
          [
            [
              110,
              350
            ],
            [
              240,
              350
            ],
            [
              240,
              380
            ],
            [
              110,
              380
            ]
          ],
          [
            [
              160,
              380
            ],
            [
              190,
              380
            ],
            [
              190,
              415
            ],
            [
              160,
              415
            ]
          ]
        ],
        "anchors": [
          [
            130,
            365
          ],
          [
            220,
            365
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
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
          75,
          100
        ]
      ],
      [
        3,
        [
          265,
          180
        ]
      ],
      [
        5,
        [
          70,
          265
        ]
      ],
      [
        6,
        [
          285,
          300
        ]
      ],
      [
        4,
        [
          130,
          265
        ]
      ],
      [
        7,
        [
          240,
          300
        ]
      ]
    ]
  },
  {
    "packIndex": 7,
    "id": "v7-last-assembly",
    "name": "Last assembly",
    "tip": "Read the whole stack: the broad head, offset stop, and two low catches share the same exit.",
    "rationale": "Read the whole stack: the broad head, offset stop, and two low catches share the same exit.",
    "pieces": [
      {
        "outline": [
          [
            65,
            80
          ],
          [
            295,
            80
          ],
          [
            295,
            120
          ],
          [
            200,
            120
          ],
          [
            200,
            225
          ],
          [
            160,
            225
          ],
          [
            160,
            120
          ],
          [
            65,
            120
          ]
        ],
        "components": [
          [
            [
              65,
              80
            ],
            [
              295,
              80
            ],
            [
              295,
              120
            ],
            [
              65,
              120
            ]
          ],
          [
            [
              160,
              120
            ],
            [
              200,
              120
            ],
            [
              200,
              225
            ],
            [
              160,
              225
            ]
          ]
        ],
        "anchors": [
          [
            90,
            100
          ],
          [
            270,
            100
          ],
          [
            180,
            195
          ]
        ]
      },
      {
        "bar": [
          [
            55,
            270
          ],
          [
            140,
            270
          ]
        ]
      },
      {
        "outline": [
          [
            255,
            242.5
          ],
          [
            297.5,
            290
          ],
          [
            255,
            337.5
          ],
          [
            212.5,
            290
          ]
        ],
        "anchors": [
          [
            255,
            270
          ],
          [
            255,
            315
          ]
        ]
      },
      {
        "bar": [
          [
            110,
            385
          ],
          [
            220,
            385
          ]
        ]
      }
    ],
    "spareCount": 2,
    "hidden": [],
    "solution": [
      [
        5,
        [
          105,
          35
        ]
      ],
      [
        6,
        [
          245,
          35
        ]
      ],
      [
        8,
        [
          255,
          270
        ]
      ],
      [
        7,
        [
          255,
          315
        ]
      ],
      [
        1,
        [
          110,
          385
        ]
      ],
      [
        4,
        [
          220,
          385
        ]
      ],
      [
        0,
        [
          140,
          270
        ]
      ],
      [
        3,
        [
          270,
          100
        ]
      ],
      [
        2,
        [
          90,
          100
        ]
      ]
    ]
  }
];
