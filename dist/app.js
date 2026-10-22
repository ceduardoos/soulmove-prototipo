// SoulMove prototype skeleton.
// Product data, demo state and screen rendering are intentionally separated so
// another developer or AI model can evolve the interface without rewriting the flow.

const campaign = {
  sponsor: "VIVA",
  title: "Sua jornada vale mais",
  goal: "Complete 3 jornadas elegíveis entre 10 e 25 de setembro.",
  reward: "12 Pontos Soul + oferta exclusiva",
  rewardPoints: 12,
  distanceKm: 8.4,
  avoidedKg: 1.1,
  coupon: "MOVE15",
  totalJourneys: 3,
  completedJourneys: 2,
  rankBefore: 24,
  rankAfter: 18,
  activeDays: 2,
};

const baseMetrics = {
  reached: 1240,
  participants: 312,
  started: 274,
  validated: 231,
  benefits: 188,
  offerVisits: 96,
  conversions: 27,
  rankingViews: 418,
  shares: 74,
  visitsFromShares: 129,
};

const initialState = () => ({
  mode: "free",
  journeys: [],
  currentJourney: null,
  selectedJourney: null,
  segments: [],
  cycle: "week",
  outcome: "validated",
  campaignProgress: 2,
  rewardIssued: false,
  offerOpened: false,
  couponIssued: false,
  campaignStatus: "active",
  campaignAccepted: false,
  reservation: 0,
  businessZone: "all",
  reportVersion: 0,
  campaignDraft: false,
  perspective: "user",
  screen: "feed",
  points: 520,
  joined: false,
  consentLocation: false,
  consentRules: false,
  journeyStarted: false,
  journeyProgress: 0,
  validated: false,
  rankingViewed: false,
  rankingVisible: true,
  activeStory: "campaign",
  activePost: "campaign",
  commentsReturn: "feed",
  overlayReturn: "feed",
  walletReturn: "feed",
  marketplaceReturn: "feed",
  missionsFilter: "all",
  campaignReturn: "move-home",
  likedPosts: [],
  likedClipz: [],
  userComments: {},
  proofType: "",
  walletBalanceVisible: true,
  marketplaceQuery: "",
  marketplaceCategory: "Todos",
  sharePublished: false,
  shareChannel: "",
  benefitUnlocked: false,
  conversion: false,
});

let state = initialState();
let journeyTimers = [];
let toastTimer;

const root = document.querySelector("#prototype-root");
const toast = document.querySelector("#toast");

function icon(name, size = 20) {
  // Vector contours from the supplied Soul icon references; currentColor preserves UI states.
  const soulIcons = {"bag": "<g stroke=\"none\" fill-rule=\"evenodd\"><path fill=\"currentColor\" d=\"M8.042,2.000 16.045,2.000 16.722,2.072 17.645,2.346 18.525,2.822 19.404,3.601 19.938,4.336 20.356,5.230 20.601,6.254 21.841,17.400 21.640,18.626 21.178,19.664 20.745,20.270 20.226,20.803 19.404,21.394 18.482,21.798 17.386,22.000 6.398,21.986 5.259,21.712 4.350,21.250 3.370,20.414 2.793,19.635 2.461,18.957 2.260,18.294 2.159,16.968 3.384,6.297 3.572,5.417 3.802,4.812 4.278,3.990 5.230,2.995 5.864,2.577 6.571,2.260 7.292,2.072 8.042,2.000Z M9.008,6.888 9.296,6.888 9.570,6.989 9.902,7.364 9.988,8.965 10.147,9.498 10.378,9.902 11.041,10.493 11.805,10.738 12.642,10.637 13.074,10.421 13.464,10.089 13.752,9.686 13.983,9.066 14.026,7.566 14.141,7.263 14.358,7.032 14.689,6.888 14.978,6.888 15.252,6.989 15.511,7.234 15.627,7.494 15.641,8.936 15.482,9.743 15.122,10.565 14.776,11.056 14.213,11.603 13.694,11.950 12.959,12.252 12.180,12.382 11.517,12.353 10.810,12.180 10.147,11.863 9.527,11.387 9.008,10.782 8.662,10.161 8.446,9.527 8.345,8.893 8.359,7.494 8.633,7.061 9.008,6.888Z M20.198,17.400 18.957,6.311 18.583,5.259 18.236,4.754 17.862,4.379 16.982,3.846 16.001,3.629 7.984,3.629 7.465,3.702 6.903,3.889 6.369,4.192 5.778,4.725 5.288,5.490 5.028,6.340 3.788,16.996 3.802,17.674 4.004,18.424 4.394,19.116 4.870,19.621 5.735,20.154 6.701,20.385 17.516,20.356 18.583,19.996 19.404,19.347 19.981,18.438 20.154,17.862 20.198,17.400Z\"/></g>", "search": "<g stroke=\"none\" fill-rule=\"evenodd\"><path fill=\"currentColor\" d=\"M7.827,2.000 9.189,2.073 10.653,2.527 11.956,3.347 12.527,3.889 13.098,4.606 13.567,5.441 13.903,6.363 14.079,7.344 14.094,8.296 13.977,9.145 13.684,10.097 13.347,10.799 12.747,11.663 21.605,20.814 21.736,21.078 21.751,21.414 21.473,21.868 21.151,22.000 20.858,21.985 20.609,21.868 11.707,12.659 10.726,13.245 9.526,13.669 8.530,13.816 7.198,13.742 5.953,13.391 4.943,12.864 4.108,12.205 3.259,11.209 2.820,10.448 2.542,9.760 2.264,8.413 2.307,7.022 2.483,6.231 2.747,5.514 3.508,4.255 4.182,3.537 4.767,3.069 5.411,2.673 6.173,2.337 6.934,2.117 7.827,2.000Z M12.688,8.076 12.659,7.271 12.425,6.348 12.015,5.514 11.473,4.811 10.785,4.211 9.950,3.742 9.130,3.479 8.354,3.376 7.505,3.420 6.612,3.654 5.836,4.035 5.133,4.562 4.504,5.265 4.064,6.012 3.772,6.846 3.654,7.593 3.684,8.515 3.918,9.452 4.284,10.214 4.753,10.858 5.294,11.385 5.997,11.868 6.846,12.234 7.842,12.425 8.676,12.410 9.599,12.205 10.404,11.839 11.180,11.283 11.854,10.536 12.293,9.789 12.615,8.823 12.688,8.076Z\"/></g>", "flame": "<g stroke=\"none\" fill-rule=\"evenodd\"><path fill=\"currentColor\" d=\"M13.471,2.000 13.913,2.049 14.121,2.172 14.330,2.417 14.624,3.937 14.906,4.685 15.225,5.286 16.034,6.451 17.910,8.744 18.524,9.652 19.039,10.571 19.443,11.516 19.787,12.742 19.922,13.833 19.885,14.998 19.590,16.408 18.977,17.831 18.119,19.082 16.856,20.308 15.703,21.068 14.269,21.669 12.785,21.963 11.877,22.000 11.129,21.951 9.633,21.632 8.334,21.080 7.071,20.234 5.881,19.057 5.010,17.782 4.655,17.046 4.373,16.261 4.091,14.716 4.128,13.294 4.471,11.810 4.753,11.111 5.219,10.253 6.200,8.965 7.451,7.837 7.868,7.567 8.125,7.506 8.395,7.530 8.726,7.702 8.959,8.033 9.167,8.891 9.425,9.419 9.597,8.143 9.915,6.733 10.234,5.777 10.712,4.735 11.399,3.692 12.098,2.932 12.785,2.368 13.189,2.098 13.471,2.000Z M5.624,14.361 5.783,15.525 6.212,16.727 6.801,17.720 7.659,18.701 8.677,19.486 9.756,20.026 10.958,20.357 12.147,20.443 13.386,20.296 14.673,19.854 15.691,19.253 16.721,18.334 17.469,17.340 17.984,16.298 18.303,15.133 18.376,13.919 18.143,12.509 17.555,11.074 16.721,9.762 14.747,7.346 14.036,6.353 13.435,5.237 13.067,4.183 12.564,4.747 12.172,5.335 11.522,6.807 11.129,8.413 10.933,9.848 10.847,11.332 10.700,11.687 10.418,11.933 10.136,12.018 9.719,11.957 9.364,11.736 8.775,11.209 8.432,10.792 7.769,9.603 6.838,10.645 6.151,11.798 5.758,12.950 5.648,13.649 5.624,14.361Z\"/></g>", "house": "<g stroke=\"none\" fill-rule=\"evenodd\"><path fill=\"currentColor\" d=\"M11.792,2.000 12.508,2.026 13.211,2.169 14.109,2.547 14.708,2.951 20.346,7.547 21.076,8.380 21.414,8.927 21.701,9.578 21.896,10.268 22.000,11.102 22.000,17.430 21.896,18.224 21.674,18.953 21.401,19.526 20.737,20.438 19.917,21.154 18.784,21.740 18.185,21.909 17.495,22.000 6.518,22.000 5.893,21.922 4.747,21.544 3.667,20.828 2.820,19.878 2.286,18.849 2.091,18.159 2.000,17.417 2.000,11.102 2.195,9.904 2.625,8.862 3.198,8.029 3.862,7.365 9.487,2.807 10.516,2.260 11.036,2.104 11.792,2.000Z M20.464,11.766 20.451,10.906 20.216,10.008 19.734,9.161 19.057,8.458 13.419,3.927 12.729,3.628 12.221,3.536 11.648,3.549 11.036,3.706 10.268,4.148 4.917,8.484 4.292,9.135 3.836,9.891 3.615,10.542 3.523,11.310 3.536,17.456 3.732,18.328 4.161,19.122 4.773,19.760 5.529,20.216 6.336,20.451 17.430,20.477 18.354,20.268 19.096,19.865 19.656,19.357 20.047,18.810 20.385,17.951 20.477,17.143 20.464,11.766Z\"/></g>", "users": "<g stroke=\"none\" fill-rule=\"evenodd\"><path fill=\"currentColor\" d=\"M11.746,4.122 12.573,4.155 13.400,4.365 14.117,4.718 14.624,5.104 15.076,5.578 15.517,6.272 15.760,6.890 15.903,7.717 15.870,8.566 15.682,9.293 15.396,9.900 14.977,10.484 14.536,10.914 13.896,11.355 13.136,11.675 12.309,11.829 11.493,11.807 10.842,11.664 10.181,11.388 9.519,10.947 8.957,10.385 8.527,9.734 8.262,9.095 8.108,8.279 8.130,7.474 8.329,6.658 8.692,5.920 9.078,5.412 9.674,4.872 10.368,4.464 11.085,4.222 11.746,4.122Z M6.300,6.052 6.542,6.096 6.752,6.261 6.862,6.515 6.829,6.846 6.620,7.099 5.892,7.331 5.374,7.772 5.098,8.334 5.043,9.029 5.109,9.381 5.275,9.778 5.693,10.275 6.300,10.594 7.006,10.705 7.237,10.914 7.325,11.157 7.281,11.454 7.094,11.686 6.840,11.785 6.322,11.752 5.782,11.609 5.275,11.355 4.922,11.090 4.525,10.671 4.216,10.186 4.007,9.646 3.907,9.106 3.907,8.566 4.007,8.025 4.194,7.540 4.503,7.055 4.911,6.636 5.297,6.372 5.793,6.151 6.300,6.052Z M17.645,6.052 18.174,6.140 18.692,6.361 19.056,6.603 19.442,6.978 19.795,7.507 19.971,7.937 20.093,8.533 20.104,9.007 20.026,9.536 19.828,10.109 19.563,10.561 19.133,11.046 18.725,11.355 18.218,11.609 17.744,11.741 17.171,11.785 16.884,11.664 16.719,11.432 16.686,11.123 16.774,10.903 17.006,10.705 17.810,10.561 18.340,10.252 18.615,9.955 18.825,9.591 18.968,8.974 18.891,8.279 18.560,7.684 17.998,7.276 17.402,7.110 17.171,6.824 17.138,6.537 17.215,6.316 17.402,6.129 17.645,6.052Z M9.233,8.180 9.321,8.687 9.552,9.249 9.828,9.657 10.170,10.010 10.578,10.308 11.041,10.528 11.548,10.660 12.154,10.693 12.695,10.616 13.114,10.473 13.621,10.186 14.106,9.756 14.437,9.293 14.646,8.830 14.767,8.301 14.778,7.772 14.668,7.187 14.459,6.691 14.183,6.283 13.863,5.953 13.400,5.622 12.970,5.423 12.463,5.291 11.835,5.258 11.327,5.335 10.853,5.501 10.324,5.809 9.894,6.206 9.596,6.614 9.387,7.055 9.255,7.573 9.233,8.180Z M4.789,12.469 5.142,12.502 5.396,12.700 5.495,12.954 5.407,13.351 5.153,13.560 4.370,13.681 3.797,13.935 3.389,14.310 3.191,14.696 3.136,15.269 3.246,15.688 3.588,16.162 4.095,16.526 4.205,16.768 4.183,17.066 3.985,17.342 3.742,17.441 3.499,17.430 3.114,17.221 2.684,16.857 2.419,16.526 2.198,16.118 2.066,15.710 2.000,15.192 2.088,14.453 2.452,13.681 3.014,13.108 3.841,12.667 4.789,12.469Z M18.990,12.469 19.927,12.590 20.798,12.976 21.140,13.229 21.504,13.615 21.901,14.398 21.989,14.828 22.000,15.302 21.923,15.776 21.791,16.151 21.383,16.791 21.041,17.110 20.545,17.419 20.269,17.441 19.993,17.320 19.817,17.055 19.795,16.791 19.916,16.515 20.368,16.206 20.754,15.699 20.875,15.214 20.820,14.718 20.589,14.277 20.192,13.924 19.596,13.670 18.913,13.582 18.637,13.406 18.516,13.152 18.538,12.832 18.725,12.579 18.990,12.469Z M11.548,13.163 13.389,13.229 15.098,13.560 16.399,14.078 17.325,14.718 17.678,15.082 18.031,15.589 18.329,16.294 18.450,16.901 18.461,17.485 18.340,18.080 18.119,18.566 17.810,18.985 17.447,19.315 16.972,19.602 16.410,19.800 15.815,19.878 8.031,19.867 7.193,19.646 6.454,19.172 5.914,18.499 5.705,18.003 5.605,17.474 5.616,16.912 5.749,16.261 5.991,15.677 6.366,15.115 6.785,14.685 7.369,14.255 8.461,13.725 9.938,13.340 11.548,13.163Z M6.730,17.353 6.829,17.794 7.105,18.235 7.480,18.533 8.064,18.731 15.914,18.742 16.553,18.555 17.006,18.191 17.281,17.673 17.336,17.088 17.204,16.493 16.895,15.920 16.421,15.434 15.914,15.104 15.175,14.773 14.018,14.464 12.937,14.321 11.746,14.288 10.710,14.365 9.740,14.530 8.814,14.806 7.987,15.203 7.535,15.534 7.050,16.107 6.818,16.636 6.730,17.353Z\"/></g>", "play": "<g stroke=\"none\" fill-rule=\"evenodd\"><path fill=\"currentColor\" d=\"M11.767,2.000 12.698,2.025 13.843,2.189 14.623,2.390 15.654,2.780 16.560,3.245 17.126,3.648 17.302,4.063 17.252,4.440 16.937,4.818 16.434,4.931 16.132,4.830 15.063,4.214 13.881,3.786 12.723,3.572 11.566,3.547 10.673,3.660 9.855,3.862 8.849,4.252 7.730,4.893 7.403,4.931 7.189,4.881 6.862,4.642 6.698,4.264 6.786,3.774 7.151,3.421 8.258,2.818 9.453,2.365 10.572,2.113 11.767,2.000Z M4.170,6.579 4.484,6.591 4.761,6.717 4.987,6.981 5.075,7.258 5.025,7.660 4.484,8.616 4.119,9.535 3.881,10.465 3.767,11.308 3.780,12.742 4.031,14.088 4.421,15.182 5.075,16.478 5.063,16.792 4.937,17.069 4.686,17.296 4.371,17.396 4.019,17.346 3.730,17.157 3.050,15.925 2.736,15.132 2.434,14.088 2.208,12.428 2.208,11.522 2.321,10.428 2.748,8.755 3.050,8.013 3.642,6.931 3.855,6.704 4.170,6.579Z M19.579,6.579 19.969,6.616 20.296,6.843 21.063,8.289 21.591,10.000 21.792,11.761 21.679,13.447 21.252,15.157 20.899,16.025 20.358,17.031 20.107,17.283 19.767,17.396 19.390,17.333 19.164,17.182 18.962,16.881 18.912,16.629 18.987,16.264 19.453,15.447 19.881,14.365 20.107,13.472 20.233,12.541 20.233,11.396 20.006,9.987 19.679,8.994 18.962,7.648 18.912,7.421 18.937,7.157 19.101,6.843 19.314,6.667 19.579,6.579Z M10.107,7.698 10.723,7.748 11.214,7.937 14.761,10.075 15.063,10.340 15.314,10.679 15.491,11.069 15.579,11.484 15.566,12.000 15.453,12.415 15.214,12.855 14.899,13.195 11.226,15.472 10.836,15.648 10.371,15.736 9.692,15.660 9.013,15.296 8.535,14.704 8.321,13.987 8.321,9.447 8.396,9.069 8.610,8.591 8.975,8.164 9.478,7.849 10.107,7.698Z M14.208,11.748 14.157,11.409 13.981,11.195 10.560,9.132 10.132,9.057 9.906,9.157 9.742,9.333 9.667,9.535 9.667,13.887 9.767,14.126 9.943,14.289 10.358,14.365 10.585,14.277 13.969,12.201 14.157,11.975 14.208,11.748Z M7.340,19.069 7.780,19.119 8.484,19.547 9.591,20.025 10.472,20.277 11.302,20.403 12.535,20.415 13.843,20.201 14.937,19.824 16.396,19.069 16.723,19.082 17.025,19.233 17.252,19.535 17.302,19.975 17.138,20.340 16.698,20.667 15.642,21.220 14.648,21.597 13.088,21.937 12.208,22.000 11.289,21.975 10.094,21.799 9.088,21.509 7.956,21.031 7.063,20.516 6.748,20.138 6.698,19.736 6.899,19.308 7.340,19.069Z\"/></g>", "inbox": "<g stroke=\"none\" fill-rule=\"evenodd\"><path fill=\"currentColor\" d=\"M6.324,4.950 14.162,4.950 14.064,5.508 14.064,6.093 6.184,6.107 5.389,6.303 4.859,6.554 4.315,6.944 3.855,7.432 3.367,8.297 3.130,9.469 3.172,20.389 3.339,20.487 3.534,20.431 6.198,18.102 6.812,17.823 15.877,17.781 16.826,17.572 17.453,17.251 17.844,16.958 18.388,16.358 18.736,15.745 18.974,14.992 19.029,14.573 19.029,10.068 19.601,9.957 20.117,9.748 20.159,14.629 20.103,15.117 19.880,15.954 19.601,16.568 19.238,17.126 18.653,17.767 17.983,18.269 17.453,18.548 16.728,18.799 16.073,18.911 7.035,18.939 6.812,19.064 4.273,21.296 3.939,21.505 3.548,21.616 3.032,21.589 2.642,21.421 2.335,21.156 2.112,20.808 2.000,20.361 2.000,9.385 2.126,8.464 2.363,7.739 2.669,7.139 3.144,6.498 3.660,5.996 4.232,5.591 4.873,5.271 5.612,5.047 6.324,4.950Z M7.649,10.194 7.927,10.222 8.206,10.473 8.430,11.630 8.681,12.132 9.043,12.593 9.713,13.109 10.271,13.346 10.731,13.444 11.317,13.457 11.944,13.332 12.432,13.123 12.934,12.774 13.381,12.286 13.674,11.784 13.841,11.296 13.911,10.598 14.148,10.264 14.510,10.194 14.831,10.361 14.957,10.626 14.929,11.198 14.720,12.007 14.385,12.676 13.855,13.346 13.311,13.806 12.656,14.183 11.888,14.434 11.400,14.503 10.522,14.476 9.713,14.266 9.043,13.932 8.471,13.499 7.844,12.774 7.439,11.993 7.216,11.059 7.230,10.529 7.370,10.319 7.649,10.194Z\"/><path fill=\"#5360ff\" d=\"M18.095,2.370 18.834,2.384 19.545,2.537 20.075,2.760 20.675,3.151 21.191,3.653 21.582,4.225 21.847,4.852 21.986,5.536 21.986,6.205 21.861,6.847 21.596,7.488 21.177,8.102 20.675,8.590 20.201,8.911 19.406,9.245 18.736,9.371 18.011,9.371 17.356,9.245 16.589,8.925 16.003,8.520 15.515,8.018 15.124,7.404 14.873,6.735 14.775,6.163 14.789,5.452 14.915,4.866 15.180,4.238 15.626,3.597 16.226,3.053 16.909,2.662 17.481,2.467 18.095,2.370Z M18.276,4.796 18.318,7.460 18.890,7.460 18.890,4.099 17.481,4.587 17.467,5.075 18.276,4.796Z\"/></g>", "compose": "<g stroke=\"none\" fill-rule=\"evenodd\"><path fill=\"#5360ff\" d=\"M9.247,4.372 14.767,4.372 16.422,4.621 17.652,5.075 18.779,5.734 20.038,6.846 20.653,7.622 21.356,8.881 21.839,10.389 22.000,11.707 21.985,12.600 21.868,13.479 21.400,15.016 20.785,16.173 19.906,17.286 18.808,18.237 17.988,18.750 17.051,19.174 16.246,19.423 15.367,19.584 8.647,19.584 7.154,19.247 5.704,18.574 4.357,17.549 3.303,16.305 2.937,15.704 2.469,14.679 2.176,13.684 2.015,12.586 2.015,11.444 2.132,10.536 2.322,9.760 2.732,8.691 3.215,7.827 3.933,6.890 4.753,6.100 5.514,5.543 6.422,5.045 7.286,4.709 8.179,4.489 9.247,4.372Z M9.423,12.176 9.613,12.337 11.663,12.337 11.663,14.401 11.780,14.562 12.176,14.577 12.337,14.401 12.337,12.337 14.401,12.337 14.577,12.190 14.577,11.810 14.416,11.663 12.337,11.663 12.337,9.584 12.176,9.423 11.824,9.423 11.663,9.584 11.663,11.663 9.584,11.663 9.423,11.810 9.423,12.176Z\"/></g>", "wallet": "<g stroke=\"none\" fill-rule=\"evenodd\"><path fill=\"currentColor\" d=\"M14.625,2.062 16.125,2.188 17.750,3.062 18.750,4.500 19.000,5.812 20.875,7.312 21.750,9.000 22.000,16.812 21.375,19.062 19.750,20.938 17.125,21.938 6.812,21.938 4.812,21.312 3.125,19.875 2.062,17.312 2.000,9.500 2.750,6.500 4.125,4.875 5.312,4.188 14.625,2.062Z M6.125,5.250 17.750,5.375 17.000,3.938 15.250,3.188 6.125,5.250Z M16.188,10.438 18.688,10.500 19.000,11.312 18.625,11.625 15.938,11.625 15.125,12.000 14.562,12.938 14.625,14.250 15.812,15.312 18.812,15.438 19.000,16.188 18.625,16.500 15.125,16.312 13.562,14.750 13.375,12.875 13.750,11.875 14.812,10.812 16.188,10.438Z M3.188,16.562 3.875,18.875 4.938,20.000 6.188,20.625 17.250,20.750 18.188,20.500 20.000,19.062 20.750,17.250 20.750,9.938 20.438,8.875 19.312,7.375 17.438,6.500 6.875,6.438 5.812,6.688 4.062,8.000 3.375,9.375 3.188,16.562Z\"/></g>"};
  if (soulIcons[name]) return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${soulIcons[name]}</svg>`;
  const icons = {
    wallet: '<rect x="2" y="5" width="20" height="15" rx="3"/><path d="M16 10h6v5h-6a2.5 2.5 0 0 1 0-5Z"/><path d="M5 5V3h13v2"/>',
    bag: '<path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-3-2-6-5-9 0 3-2 4-3 5 0-3-1-6-3-8 0 5-4 7-4 12 0 4 4 7 8 7Z"/>',
    house: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    users: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-4 2-6 6-6s6 2 6 6"/><path d="M15 15c3 0 5 2 5 5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
    message: '<path d="M4 4h16v12H8l-4 4V4Z"/>',
    badge: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.2-1.3-2-3-2s-3 .8-3 2 1.3 2 3 2 3 .8 3 2-1.3 2-3 2-3-.8-3-2"/>',
    leaf: '<path d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z"/><path d="M4 21c3-6 7-9 13-12"/>',
    ellipsis: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    heart: '<path d="M20.5 9c0 6-8.5 11-8.5 11S3.5 15 3.5 9A4.5 4.5 0 0 1 12 6.8 4.5 4.5 0 0 1 20.5 9Z"/>',
    arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9H8a2.5 2.5 0 1 1 4-2.5V9Zm0 0h4a2.5 2.5 0 1 0-4-2.5V9Z"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    video: '<rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 9 4-2v10l-4-2"/>',
    share: '<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3 8 8 10 5-2 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2 11h11l2-8H6"/>',
    trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 12v5M8 21h8M9 17h6"/>',
    trend: '<path d="m4 16 5-5 4 4 7-8"/><path d="M15 7h5v5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    camera: '<path d="M4 7h4l2-2h4l2 2h4v12H4V7Z"/><circle cx="12" cy="13" r="4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m3 17 5-4 4 3 3-2 6 4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.7"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6"/>',
    bulb: '<path d="M9 18h6M10 22h4"/><path d="M8.5 15.5A6 6 0 1 1 15.5 15.5C14.6 16.1 14 17 14 18h-4c0-1-.6-1.9-1.5-2.5Z"/>',
    bolt: '<path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-8 8-8s8 3 8 8"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  };
  const path = icons[name] || icons.target;
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function clearJourneyTimers() {
  journeyTimers.forEach(clearTimeout);
  journeyTimers = [];
}

function systemBar() {
  return '<div class="system-bar"><span>19:20</span><span>5G&nbsp;&nbsp;29%</span></div>';
}

function topBar() {
  return `<header class="app-topbar">
    <button class="balance-pill" type="button" data-action="wallet">${icon("wallet", 18)}<span>${state.points} Pts</span></button>
    <button class="icon-button" type="button" aria-label="Marketplace" data-action="marketplace">${icon("bag")}</button>
    <span class="top-spacer"></span>
    <button class="icon-button" type="button" aria-label="Pesquisar" data-action="prototype-notice" data-message="Busca representada apenas visualmente nesta demonstração">${icon("search")}</button>
    <button class="icon-button" type="button" aria-label="Atividades" data-action="missions">${icon("flame")}</button>
    <span class="avatar member-photo member-carlos" role="img" aria-label="Perfil de Carlos Eduardo"></span>
  </header>`;
}

function bottomNav(active) {
  return `<nav class="bottom-nav" aria-label="Navegação da SoulUP">
    <button class="nav-button ${active === "feed" ? "active" : ""}" type="button" data-nav="feed" aria-label="Início">${icon("house")}</button>
    <button class="nav-button ${active === "communities" ? "active" : ""}" type="button" data-nav="communities" aria-label="Comunidades">${icon("users")}</button>
    <button class="nav-button" type="button" data-action="prototype-notice" data-message="Criação de conteúdo simulada neste protótipo" aria-label="Criar conteúdo"><span class="nav-plus">${icon("compose", 54)}</span></button>
    <button class="nav-button ${active === "clipz" ? "active" : ""}" type="button" data-nav="clipz" aria-label="Clipz">${icon("play")}</button>
    <button class="nav-button" type="button" data-action="prototype-notice" data-message="Mensagens não fazem parte desta demonstração" aria-label="Conversas">${icon("inbox")}</button>
  </nav>`;
}

function phone(content, options = {}) {
  const showTop = options.top !== false;
  const showBottom = options.bottom !== false;
  return `<div class="user-stage"><section class="phone" aria-label="Aplicativo SoulUP com SoulMove">
    ${systemBar()}
    ${showTop ? topBar() : ""}
    <main class="phone-main">${content}</main>
    ${showBottom ? bottomNav(options.active || "feed") : ""}
  </section></div>`;
}

function isLiked(collection, id) { return state[collection].includes(id); }
function completedUserJourneys() { return state.campaignProgress; }

function socialActions(id, baseLikes, baseComments, collection = "likedPosts") {
  const liked = isLiked(collection, id);
  const comments = baseComments + (state.userComments[id] ? 1 : 0);
  const likeAction = collection === "likedClipz" ? "toggle-clipz-like" : "toggle-post-like";
  return `<div class="post-actions social-actions"><button class="social-button ${liked ? "active" : ""}" type="button" data-action="${likeAction}" data-id="${id}" aria-label="Curtir">${icon("heart")}<span>${baseLikes + (liked ? 1 : 0)}</span></button><button class="social-button" type="button" data-action="open-comments" data-id="${id}" aria-label="Comentários">${icon("message")}<span>${comments}</span></button><button class="social-button" type="button" data-action="share-post" aria-label="Compartilhar">${icon("share")}</button></div>`;
}

function renderFeed() {
  return phone(`
    <section class="stories" aria-label="Stories">
      <button class="story" type="button" data-action="open-story" data-story="ads"><span class="story-ring"><span class="story-core">${icon("badge")}</span></span><span class="story-label">Ads</span></button>
      <button class="story" type="button" data-action="open-story" data-story="soulmove"><span class="story-ring"><span class="story-core story-photo"></span></span><span class="story-label">SoulMove</span></button>
      <button class="story" type="button" data-action="open-story" data-story="community"><span class="story-ring"><span class="story-core story-community">${icon("users")}</span></span><span class="story-label">Mobilidade</span></button>
      <button class="story" type="button" data-action="open-story" data-story="marketplace"><span class="story-ring"><span class="story-core story-market">${icon("bag")}</span></span><span class="story-label">Benefícios</span></button>
      <button class="story" type="button" data-action="prototype-notice" data-message="Criação de story simulada neste protótipo"><span class="story-ring muted"><span class="story-core">${icon("plus")}</span></span><span class="story-label">Seu story</span></button>
    </section>
    <article class="feed-post">
      <header class="post-head"><span class="post-avatar user-one">LS</span><div class="post-author"><strong>Luiza Santos</strong><span>Comunidade Mobilidade em movimento • 18 min</span></div>${icon("ellipsis")}</header>
      <button class="organic-post-card mission-feed-entry" type="button" data-action="missions"><span>${icon("flame", 24)}</span><small>MISSÕES SOULUP</small><h2>Pequenas escolhas. Novas conquistas.</h2><p>Conheça as missões e acompanhe sua mobilidade.</p><span class="mission-feed-link">Explorar missões ${icon("arrow",16)}</span></button>
      ${socialActions("community", 42, 6)}
      <p class="caption"><strong>Luiza Santos</strong> Começando a semana com constância 💙</p>
    </article>
    <article class="feed-post campaign-post">
      <header class="post-head"><span class="post-avatar brand">${icon("leaf", 18)}</span><div class="post-author"><strong>${campaign.sponsor}</strong><span>Patrocinado • campanha demonstrativa</span></div>${icon("ellipsis")}</header>
      <button class="campaign-art" type="button" data-action="open-campaign"><img src="./assets/soulmove-campaign.webp" alt="Passageira utilizando transporte público em uma cidade"><span class="campaign-art-overlay"><span><small>DESAFIO SOULMOVE</small><h1>${campaign.title}</h1><p>Três jornadas elegíveis de 10 a 25 de setembro.</p></span><span class="campaign-reward">+${campaign.rewardPoints} Pontos Soul + benefício</span></span></button>
      ${socialActions("campaign", 186, 23)}
      <button class="feed-cta" type="button" data-action="open-campaign">Conhecer a campanha ${icon("arrow", 17)}</button>
      <p class="caption"><strong>${campaign.sponsor}</strong> Reconheça deslocamentos que já fazem parte da sua rotina.</p>
    </article>
    <article class="feed-post">
      <header class="post-head"><span class="post-avatar user-two">RM</span><div class="post-author"><strong>Rafael Martins</strong><span>Compartilhou uma conquista SoulMove • 1 h</span></div>${icon("ellipsis")}</header>
      <button class="achievement-post" type="button" data-action="public-achievement"><span class="achievement-label">${icon("check", 15)} JORNADA VALIDADA</span><h2>${campaign.title}</h2><div class="achievement-stats"><div><strong>7,1 km</strong><span>transporte público</span></div><div><strong>+${campaign.rewardPoints}</strong><span>Pontos Soul</span></div><div><strong>#12</strong><span>Liga semanal</span></div></div><p>3 de 3 jornadas · meta da campanha concluída</p></button>
      ${socialActions("achievement", 73, 11)}
      <p class="caption"><strong>Rafael Martins</strong> Mais uma jornada concluída! 🌿</p>
    </article>
    <article class="feed-post">
      <header class="post-head"><span class="post-avatar market-avatar">${icon("bag", 18)}</span><div class="post-author"><strong>Soul Marketplace</strong><span>Benefícios para a comunidade • 3 h</span></div>${icon("ellipsis")}</header>
      <button class="marketplace-post-card" type="button" data-action="marketplace"><small>NOVAS OFERTAS</small><h2>Seus Pontos Soul também viram benefícios.</h2><p>Conheça recompensas de mobilidade, bem-estar e consumo consciente.</p><span>Explorar marketplace ${icon("chevron", 16)}</span></button>
      ${socialActions("marketplace", 91, 14)}
    </article>`, { active: "feed" });
}

function renderCommunities() {
  return phone(`<section class="page">
    <header class="page-title-row"><div><h1>Comunidades</h1><p class="page-subtitle">Encontre, participe e crie comunidades que combinam com você.</p></div>${icon("search")}</header>
    <section class="community-hero">${icon("users", 24)}<h2>Mobilidade em movimento</h2><p>Participe de missões e acompanhe conquistas da comunidade SoulMove.</p><button class="light-button" type="button" data-action="open-campaign">Ver missão da comunidade</button></section>
    <h2 class="section-heading">Missão em destaque</h2>
    <button class="mission-line" type="button" data-action="open-campaign"><span class="mission-logo">${icon("leaf")}</span><span class="mission-copy"><strong>${campaign.title}</strong><span>3 jornadas • Pontos Soul • oferta exclusiva</span></span>${icon("chevron")}</button>
  </section>`, { active: "communities" });
}

function clipzSide(id, likes, comments) {
  const liked = isLiked("likedClipz", id);
  return `<div class="clipz-side"><button class="${liked ? "active" : ""}" type="button" data-action="toggle-clipz-like" data-id="${id}">${icon("heart")}<span>${likes + (liked ? 1 : 0)}</span></button><button type="button" data-action="open-comments" data-id="${id}">${icon("message")}<span>${comments + (state.userComments[id] ? 1 : 0)}</span></button><button type="button" data-action="share-post">${icon("share")}<span>Enviar</span></button></div>`;
}

function renderClipz() {
  return phone(`<section class="clipz-screen"><header class="clipz-head"><span></span><div class="clipz-tabs"><button class="clipz-tab active" type="button">Clipz</button><button class="clipz-tab" type="button" data-action="prototype-notice" data-message="Filtro Amigos representado visualmente">Amigos</button></div><button class="create-clip" type="button" data-action="prototype-notice" data-message="Criação de Clipz simulada"><span class="create-circle">${icon("video")}</span>CRIAR</button></header>
    <div class="clipz-feed" aria-label="Conteúdos Clipz roláveis">
      <article class="clipz-slide clipz-routine"><div class="clipz-copy"><small>@luizasantos • COMUNIDADE</small><h1>Minha cidade começa nas escolhas da rotina</h1><p>Hoje fui de transporte público e aproveitei o caminho para desacelerar.</p><span class="clipz-hint">Role para ver o próximo Clipz ↓</span></div>${clipzSide("clipz-routine", 324, 38)}<div class="clipz-user"><span class="post-avatar user-one">LS</span><div><strong>Luiza Santos</strong><br><small>#MobilidadeEmMovimento</small></div></div></article>
      <article class="clipz-slide clipz-campaign"><img src="./assets/soulmove-campaign.webp" alt="Passageira em transporte público"><div class="clipz-shade"></div><div class="clipz-copy"><small>${campaign.sponsor} • CONTEÚDO PATROCINADO</small><h1>Sua jornada vale mais</h1><p>Complete três jornadas, receba ${campaign.rewardPoints} Pontos Soul e desbloqueie uma oferta.</p><button class="dark-outline-button" type="button" data-action="open-campaign">Participar da missão</button></div>${clipzSide("clipz-campaign", 512, 64)}<div class="clipz-user"><span class="post-avatar brand">${icon("leaf", 18)}</span><div><strong>${campaign.sponsor}</strong><br><small>Campanha demonstrativa</small></div></div></article>
      <article class="clipz-slide clipz-achievement"><div class="clipz-copy"><small>@rafaelmartins • CONQUISTA SOULMOVE</small><span class="clipz-check">${icon("check", 22)}</span><h1>Jornada validada</h1><div class="clipz-result-grid"><div><strong>7,1 km</strong><span>transporte público</span></div><div><strong>+${campaign.rewardPoints}</strong><span>Pontos Soul</span></div><div><strong>#12</strong><span>Liga semanal</span></div></div><p>Constância que vira conquista e inspira a comunidade.</p><button class="dark-outline-button" type="button" data-action="open-campaign">Conhecer o desafio</button></div>${clipzSide("clipz-achievement", 271, 29)}<div class="clipz-user"><span class="post-avatar user-two">RM</span><div><strong>Rafael Martins</strong><br><small>3 de 3 jornadas · meta concluída</small></div></div></article>
    </div>
  </section>`, { top: false, active: "clipz" });
}

function innerScreen(title, body, footer = "") {
  return phone(`<header class="inner-header"><button class="icon-button" type="button" data-action="back" aria-label="Voltar">${icon("back")}</button><strong>${title}</strong><span></span></header>${body}${footer}`, { top: false, bottom: false });
}

function renderCampaignDetail() {
  return innerScreen("Campanha", `<section class="page">
    <div class="campaign-visual"><small>Campanha demonstrativa • ${campaign.sponsor}</small><h1>${campaign.title}</h1><p>Transforme deslocamentos que já fazem parte da sua rotina em impacto e benefícios.</p></div>
    <div class="info-row">${icon("target")}<div><strong>Meta da campanha</strong><span>${campaign.goal}</span></div></div>
    <div class="info-row">${icon("gift")}<div><strong>Recompensa demonstrativa</strong><span>${campaign.reward}.</span></div></div>
    <div class="info-row">${icon("shield")}<div><strong>Privacidade</strong><span>A marca recebe resultados agregados, nunca seu trajeto individual.</span></div></div>
    <div class="info-row">${icon("route")}<div><strong>Prova principal</strong><span>Telemetria — GPS, tempo e velocidade — combinada com checkpoints em sequência.</span></div></div>
    <div class="info-row">${icon("camera")}<div><strong>Prova complementar opcional</strong><span>Ao finalizar, você poderá anexar uma foto ou um vídeo. Isso não é obrigatório para concluir a jornada.</span></div></div>
    <div class="info-row">${icon("trophy")}<div><strong>Ranking da campanha</strong><span>Jornadas válidas e constância aproximam você da meta. Distância e velocidade não definem a posição.</span><button class="inline-link" type="button" data-action="ranking">Ver ranking da comunidade</button></div></div>
  </section>`, `<footer class="sticky-action"><button class="primary-button" type="button" data-action="join">${state.joined ? "Continuar campanha" : "Participar da campanha"}</button></footer>`);
}

function renderConsent() {
  const enabled = state.consentLocation && state.consentRules;
  return innerScreen("Permissões", `<section class="form-section">
    <h1>Antes de começar</h1><p>Você controla os dados utilizados para validar sua participação.</p>
    <label class="consent-option"><input type="checkbox" data-consent="location" ${state.consentLocation ? "checked" : ""}><span><strong>Localização durante a jornada</strong><span>Permite registrar GPS, tempo e checkpoints somente enquanto a missão estiver ativa.</span></span></label>
    <label class="consent-option"><input type="checkbox" data-consent="rules" ${state.consentRules ? "checked" : ""}><span><strong>Regras da campanha</strong><span>Confirmo que li os critérios de validação e de concessão da recompensa.</span></span></label>
    <div class="privacy-note">O patrocinador verá apenas indicadores agregados. A câmera será solicitada somente se você optar por uma prova complementar; o anexo não será exibido à marca.</div>
  </section>`, `<footer class="sticky-action"><button class="primary-button" type="button" data-action="consent-continue" ${enabled ? "" : "disabled"}>Confirmar e continuar</button></footer>`);
}

function renderReady() {
  return innerScreen("SoulMove", `<section class="form-section">
    <h1>Pronto para sua jornada?</h1><p>Inicie quando já estiver preparado para o deslocamento. Você não precisa acompanhar o celular durante o percurso.</p>
    <div class="ready-summary"><div class="ready-row"><span>Campanha</span><strong>${campaign.title}</strong></div><div class="ready-row"><span>Meta</span><strong>3 jornadas</strong></div><div class="ready-row"><span>Prova principal</span><strong>Telemetria + checkpoints</strong></div><div class="ready-row"><span>Recompensa</span><strong>${campaign.reward}</strong></div></div>
    <div class="proof-explainer"><span>${icon("shield", 22)}</span><div><strong>A validação principal acontece em segundo plano</strong><p>Foto ou vídeo poderão ser adicionados ao final apenas como prova complementar.</p></div></div>
    <div class="privacy-note">Para a demonstração, o protótipo reproduzirá uma sequência simulada de localização.</div>
  </section>`, `<footer class="sticky-action"><button class="primary-button" type="button" data-action="start-journey">Iniciar jornada demonstrativa</button></footer>`);
}

function renderJourney() {
  return phone(`<section class="journey-page">
    <div class="journey-status"><span class="status-dot"></span>Telemetria em andamento</div><h1>Continue seu deslocamento</h1><p>GPS, tempo, velocidade e checkpoints são registrados em segundo plano. Não interaja com o celular durante o percurso.</p>
    <div class="checkpoint-track"><div class="track-line"><div class="track-progress" id="track-progress"></div><span class="checkpoint" data-checkpoint="1">${icon("pin", 16)}</span><span class="checkpoint" data-checkpoint="2">${icon("pin", 16)}</span><span class="checkpoint" data-checkpoint="3">${icon("pin", 16)}</span><span class="checkpoint" data-checkpoint="4">${icon("check", 16)}</span></div></div>
    <div class="journey-metrics"><div class="journey-metric"><strong id="journey-time">00:00</strong><span>tempo simulado</span></div><div class="journey-metric"><strong id="journey-distance">0,0 km</strong><span>distância</span></div><div class="journey-metric"><strong id="journey-checkpoints">0/4</strong><span>checkpoints</span></div></div>
    <button class="primary-button" id="finish-journey" type="button" data-action="finish-journey" disabled>Concluir prova principal</button>
  </section>`, { top: false, bottom: false });
}

function renderProof() {
  const selected = state.proofType;
  return innerScreen("Provas da jornada", `<section class="page proof-page"><span class="proof-complete">${icon("check", 22)}</span><h1>Prova principal recebida</h1><p class="page-subtitle">A telemetria e os quatro checkpoints já são suficientes para enviar esta jornada à validação.</p>
    <div class="primary-proof"><div>${icon("route", 22)}<span><strong>Telemetria</strong><small>GPS, tempo e velocidade</small></span>${icon("check", 18)}</div><div>${icon("pin", 22)}<span><strong>Checkpoints</strong><small>4 pontos em sequência</small></span>${icon("check", 18)}</div></div>
    <div class="optional-proof-heading"><div><h2>Prova complementar</h2><p>Foto ou vídeo são opcionais e reforçam a análise quando o desafio solicitar contexto adicional.</p></div><span>OPCIONAL</span></div>
    <div class="proof-options"><button class="${selected === "Foto" ? "selected" : ""}" type="button" data-action="select-proof" data-proof="Foto">${icon("camera", 23)}<strong>Foto</strong><small>Captura simulada</small></button><button class="${selected === "Vídeo" ? "selected" : ""}" type="button" data-action="select-proof" data-proof="Vídeo">${icon("video", 23)}<strong>Vídeo</strong><small>Registro simulado</small></button></div>
    ${selected ? `<div class="proof-selected">${icon(selected === "Foto" ? "image" : "video", 22)}<span><strong>${selected} adicionada</strong><small>Prova complementar demonstrativa pronta para envio.</small></span><button type="button" data-action="remove-proof">Remover</button></div>` : `<div class="proof-empty">Você pode continuar sem anexar nenhuma mídia.</div>`}
    <div class="privacy-note">A prova complementar seria utilizada somente na validação e seguiria regras de retenção. Ela não seria entregue ao patrocinador.</div>
  </section>`, `<footer class="sticky-action"><button class="primary-button" type="button" data-action="submit-proof">${selected ? `Enviar ${selected.toLowerCase()} e validar` : "Validar sem prova complementar"}</button></footer>`);
}

function renderValidation() {
  return phone(`<section class="validation-page"><div class="spinner" aria-hidden="true"></div><h1>Validando sua jornada</h1><p>O SoulMove está conferindo as evidências e aplicando as regras antifraude.</p><div class="validation-list"><div class="validation-label">PROVA PRINCIPAL</div><div class="validation-item complete">${icon("check")} Telemetria: GPS, tempo e velocidade</div><div class="validation-item complete">${icon("check")} Checkpoints e sequência compatível</div><div class="validation-label complementary">PROVA COMPLEMENTAR</div><div class="validation-item ${state.proofType ? "complete" : "optional"}">${icon(state.proofType ? "check" : "camera")} ${state.proofType ? `${state.proofType} demonstrativa anexada` : "Não anexada — etapa opcional"}</div></div></section>`, { top: false, bottom: false });
}

function renderResult() {
  return phone(`<section class="success-page"><span class="success-icon">${icon("check", 36)}</span><h1>Jornada validada!</h1><p>Os sinais da demonstração atingiram o nível de confiança necessário.</p>
    <div class="result-summary"><div><strong>+${campaign.rewardPoints}</strong><span>Pontos Soul</span></div><div><strong>${campaign.distanceKm.toFixed(1).replace(".", ",")} km</strong><span>distância</span></div><div><strong>${campaign.avoidedKg.toFixed(1).replace(".", ",")} kg</strong><span>CO₂ estimado*</span></div></div>
    <button class="wallet-credit-link" type="button" data-action="wallet-detail">${icon("wallet", 18)} <span><strong>+${campaign.rewardPoints} Pontos Soul creditados</strong><small>Ver movimentação na carteira</small></span>${icon("chevron", 17)}</button>
    <button class="rank-update" type="button" data-action="ranking"><span class="rank-position">#${campaign.rankAfter}</span><span><strong>Você subiu ${campaign.rankBefore - campaign.rankAfter} posições</strong><small>${completedUserJourneys()} de ${campaign.totalJourneys} jornadas • ${campaign.activeDays + 1} dias em movimento</small></span>${icon("chevron")}</button>
    <div class="action-stack"><button class="primary-button" type="button" data-action="benefit">Ver benefício desbloqueado</button><button class="secondary-button" type="button" data-action="ranking">Ver ranking da campanha</button><button class="secondary-button" type="button" data-action="share">Criar cartão compartilhável</button></div>
    <p class="page-subtitle" style="margin-top:14px">*Estimativa demonstrativa, não auditada e sem geração de crédito de carbono.</p>
  </section>`, { top: false, bottom: false });
}

const rankingLeaders = [
  { position: 1, name: "Marina S.", journeys: 3, days: 3, initials: "MS" },
  { position: 2, name: "Rafael M.", journeys: 3, days: 3, initials: "RM" },
  { position: 3, name: "Bianca L.", journeys: 3, days: 2, initials: "BL" },
];

const rankingNearby = [
  { position: 17, name: "Diego N.", journeys: 2, days: 2, initials: "DN" },
  { position: 18, name: "Você", journeys: 2, days: 2, initials: "CE", current: true },
  { position: 19, name: "Aline P.", journeys: 2, days: 1, initials: "AP" },
];

function renderRanking() {
  const completed = completedUserJourneys();
  const currentRank = state.validated ? campaign.rankAfter : campaign.rankBefore;
  const rankGain = state.validated ? campaign.rankBefore - campaign.rankAfter : 0;
  const podium = rankingLeaders.map(person => `<article class="podium-card position-${person.position}"><span class="podium-place">${person.position}º</span><span class="ranking-avatar">${person.initials}</span><strong>${person.name}</strong><small>${person.journeys}/${campaign.totalJourneys} jornadas</small><span>${person.days} dias ativos</span></article>`).join("");
  const nearby = rankingNearby.map(person => { const position = state.validated ? person.position : person.position + 6; return `<article class="ranking-row ${person.current ? "current" : ""}"><strong class="ranking-position">${position}º</strong><span class="ranking-avatar">${person.initials}</span><span class="ranking-name"><strong>${person.name}</strong><small>${person.current ? completed : person.journeys}/${campaign.totalJourneys} jornadas • ${person.current && state.validated ? person.days + 1 : person.days} dias ativos</small></span>${person.current && state.validated ? `<span class="ranking-rise">${icon("trend", 16)} +${rankGain}</span>` : ""}</article>`; }).join("");
  return innerScreen("Ranking", `<section class="page ranking-page">
    <div class="ranking-hero"><span>${icon("trophy", 25)}</span><div><small>${campaign.sponsor} • campanha demonstrativa</small><h1>${campaign.title}</h1><p>Classificação por jornadas válidas e constância.</p></div></div>
    <div class="your-rank"><div><span>Sua posição</span><strong>#${currentRank}</strong></div><div><span>Evolução</span><strong>${rankGain ? `+${rankGain}` : "—"}</strong></div><div><span>Progresso</span><strong>${completed}/${campaign.totalJourneys}</strong></div></div>
    <h2 class="section-heading">Destaques da comunidade</h2><div class="podium">${podium}</div>
    <h2 class="section-heading">Perto de você</h2><div class="ranking-list">${nearby}</div>
    <button class="secondary-button" type="button" data-action="ranking-rules">Como funciona o ranking?</button>
  </section>`);
}

function renderRankingRules() {
  return innerScreen("Critérios do ranking", `<section class="page ranking-rules"><h1>Competição sem incentivar viagens extras</h1><p class="page-subtitle">O ranking reconhece o cumprimento da missão, não quem percorre a maior distância.</p>
    <div class="info-row">${icon("shield")}<div><strong>Somente jornadas validadas</strong><span>Deslocamentos reprovados pelas regras antifraude não alteram a classificação.</span></div></div>
    <div class="info-row">${icon("clock")}<div><strong>Limite diário</strong><span>No máximo uma jornada pontuável por dia, conforme as regras desta campanha.</span></div></div>
    <div class="info-row">${icon("trend")}<div><strong>Constância como desempate</strong><span>Quem cumpre a missão em dias diferentes ganha destaque sem precisar viajar mais.</span></div></div>
    <div class="info-row">${icon("route")}<div><strong>Distância não dá vantagem</strong><span>Quilômetros, velocidade e estimativa ambiental não determinam a posição.</span></div></div>
    <label class="visibility-control"><span><strong>Aparecer no ranking</strong><small>Você pode ocultar sua posição sem perder recompensas.</small></span><input type="checkbox" data-preference="ranking" ${state.rankingVisible ? "checked" : ""}></label>
  </section>`);
}

function renderShare() {
  const completed = completedUserJourneys();
  return innerScreen("Compartilhar", `<section class="page share-page"><h1>Mostre sua conquista</h1><p class="page-subtitle">O cartão apresenta seu resultado sem revelar trajeto ou localização.</p>
    <div class="share-card"><div class="share-card-head"><span class="share-brand">${icon("leaf", 22)} SOULMOVE</span><small>${campaign.sponsor} • CAMPANHA DEMONSTRATIVA</small></div><span class="share-status">${icon("check", 14)} Jornada validada</span><h2>${campaign.title}</h2><p>Mais uma escolha de mobilidade reconhecida.</p>
      <div class="share-stats"><div><strong>${campaign.distanceKm.toFixed(1).replace(".", ",")} km</strong><span>transporte público</span></div><div><strong>+${campaign.rewardPoints}</strong><span>Pontos Soul</span></div><div><strong>${campaign.avoidedKg.toFixed(1).replace(".", ",")} kg*</strong><span>CO₂ estimado</span></div></div>
      <div class="share-progress"><div><span>Progresso da missão</span><strong>${completed} de ${campaign.totalJourneys} jornadas</strong></div><div class="share-progress-track"><span style="width:${Math.round(completed / campaign.totalJourneys * 100)}%"></span></div></div>
      <div class="share-achievements"><span>${icon("trophy", 16)} #${campaign.rankAfter} no ranking</span><span>${icon("trend", 16)} +${campaign.rankBefore - campaign.rankAfter} posições</span><span>${icon("flame", 16)} ${campaign.activeDays + (state.validated ? 1 : 0)} dias em movimento</span></div>
      <div class="share-invite">Participe deste desafio na SoulUP</div><small class="share-disclaimer">*Estimativa demonstrativa. Nenhum trajeto individual é compartilhado.</small>
    </div>
    <h2 class="share-heading">Onde compartilhar?</h2><div class="share-options"><button type="button" data-action="publish-share" data-channel="Clipz"><span>${icon("play")}</span><strong>Clipz</strong></button><button type="button" data-action="publish-share" data-channel="Comunidade"><span>${icon("users")}</span><strong>Comunidade</strong></button><button type="button" data-action="publish-share" data-channel="Compartilhamento externo"><span>${icon("globe")}</span><strong>Outros apps</strong></button></div>
    <button class="secondary-button" type="button" data-action="benefit">Continuar sem publicar</button>
  </section>`);
}

function renderBenefit() {
  const actionLabel = state.benefitUnlocked ? "Ver oferta ativada" : "Ativar benefício";
  return innerScreen("Marketplace", `<section class="page"><div class="page-title-row"><div><h1>Benefício desbloqueado</h1><p class="page-subtitle">Disponível após a validação da campanha.</p></div>${icon("bag")}</div><article class="benefit-card"><div class="benefit-brand">V</div><h2>15% de desconto</h2><p>Oferta demonstrativa da ${campaign.sponsor} para participantes que concluíram a jornada.</p><div class="coupon"><span>Cupom da campanha</span><code>${campaign.coupon}</code></div><button class="primary-button" type="button" data-action="activate-offer">${actionLabel}</button></article><div class="privacy-note">A conversão poderá ser atribuída por link, cupom ou leitura fiscal quando houver integração técnica.</div></section>`);
}

function renderOffer() {
  return innerScreen("Oferta", `<section class="success-page"><span class="success-icon">${icon("gift", 34)}</span><h1>Oferta ativada</h1><p>O cupom está disponível para esta campanha demonstrativa.</p><div class="coupon" style="width:100%; margin-top:22px"><span>Código</span><code>${campaign.coupon}</code><button class="icon-button" type="button" data-action="copy-coupon" aria-label="Copiar cupom">${icon("copy")}</button></div><div class="action-stack"><button class="primary-button" type="button" data-action="register-conversion">Registrar compra demonstrativa</button><button class="secondary-button" type="button" data-action="open-business">Abrir SoulBusiness</button></div></section>`);
}

function renderConversion() {
  return phone(`<section class="success-page"><span class="success-icon">${icon("cart", 34)}</span><h1>Conversão registrada</h1><p>O protótipo vinculou o evento à campanha sem compartilhar o trajeto individual.</p><div class="result-summary"><div><strong>1</strong><span>oferta acessada</span></div><div><strong>1</strong><span>cupom utilizado</span></div><div><strong>1</strong><span>conversão atribuída</span></div></div><div class="action-stack"><button class="primary-button" type="button" data-action="open-business">Ver resultado no SoulBusiness</button><button class="secondary-button" type="button" data-action="reset">Reiniciar demonstração</button></div></section>`, { top: false, bottom: false });
}

const storyContent = {
  soulmove: { owner: "SoulMove", meta: "Mobilidade dentro da SoulUP", title: "Seu caminho também conta", text: "Acompanhe seu impacto na liga e descubra campanhas patrocinadas nas Missões SoulUP.", action: "move-home", label: "Explorar mobilidade", className: "story-community-view" },
  ads: { owner: "Soul Ads", meta: "Conteúdo demonstrativo", title: "Benefícios que combinam com você", text: "Descubra ofertas e missões disponíveis no ecossistema SoulUP.", action: "marketplace", label: "Explorar benefícios", className: "story-ads" },
  campaign: { owner: campaign.sponsor, meta: "Patrocinado • campanha demonstrativa", title: campaign.title, text: `Complete três jornadas e receba ${campaign.rewardPoints} Pontos Soul mais uma oferta exclusiva.`, action: "open-campaign", label: "Conhecer campanha", className: "story-campaign" },
  community: { owner: "Mobilidade em movimento", meta: "Comunidade SoulUP", title: "Sua conquista inspira novas jornadas", text: "Compartilhe progresso, acompanhe o ranking e mantenha a constância.", action: "communities", label: "Abrir comunidade", className: "story-community-view" },
  marketplace: { owner: "Soul Marketplace", meta: "Benefícios demonstrativos", title: "Pontos que viram novas possibilidades", text: "Explore ofertas de mobilidade, bem-estar e consumo consciente.", action: "marketplace", label: "Ver marketplace", className: "story-market-view" },
};

function renderStory() {
  const story = storyContent[state.activeStory] || storyContent.campaign;
  return `<div class="user-stage"><section class="phone"><section class="ad-story ${story.className}">${state.activeStory === "campaign" ? '<img src="./assets/soulmove-campaign.webp" alt="Passageira utilizando transporte público">' : ""}<div class="story-overlay"></div><div class="story-progress"><span></span></div><header class="ad-head"><span class="post-avatar brand">${icon(state.activeStory === "marketplace" ? "bag" : state.activeStory === "community" ? "users" : "leaf", 18)}</span><div><strong>${story.owner}</strong><small>${story.meta}</small></div><button class="icon-button" type="button" data-action="close-story" aria-label="Fechar">${icon("close")}</button></header><div class="ad-copy"><small>${state.activeStory === "campaign" ? "DESAFIO SOULMOVE" : "SOULUP"}</small><h1>${story.title}</h1><p>${story.text}</p><button class="dark-outline-button" type="button" data-action="${story.action}">${story.label}</button></div></section></section></div>`;
}

const commentSets = {
  community: [["AM", "Ana M.", "Também estou tentando manter a constância esta semana!"], ["JV", "João V.", "A comunidade ajuda muito a continuar."]],
  campaign: [["BC", "Bianca C.", "Gostei de poder participar usando um trajeto que já faço."], ["RF", "Rafa F.", "A recompensa aparece depois das três jornadas?"]],
  achievement: [["LS", "Luiza S.", "Parabéns pela evolução no ranking!"], ["AM", "Ana M.", "Mais uma concluída 💙"]],
  marketplace: [["DN", "Diego N.", "As ofertas de mobilidade são as minhas favoritas."], ["BL", "Bia L.", "Boa forma de usar os pontos."]],
  "clipz-routine": [["RM", "Rafael M.", "A cidade fica diferente quando a gente observa o caminho."], ["AP", "Aline P.", "Muito bom!"]],
  "clipz-campaign": [["MS", "Marina S.", "Já completei a primeira jornada."], ["DN", "Diego N.", "Vou participar!"]],
  "clipz-achievement": [["LS", "Luiza S.", "Que evolução!"], ["BC", "Bianca C.", "Rumo à terceira jornada."]],
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function renderComments() {
  const comments = commentSets[state.activePost] || commentSets.campaign;
  const userComment = state.userComments[state.activePost];
  return innerScreen("Comentários", `<section class="page comments-page"><h1>Conversa da comunidade</h1><p class="page-subtitle">Conteúdo demonstrativo para representar a interação na SoulUP.</p><div class="comments-list">${comments.map(([initials, name, message]) => `<article class="comment"><span class="post-avatar">${initials}</span><div><strong>${name}</strong><p>${message}</p><button type="button" data-action="prototype-notice" data-message="Resposta simulada">Responder</button></div></article>`).join("")}${userComment ? `<article class="comment own"><span class="post-avatar user-current">CE</span><div><strong>Você</strong><p>${escapeHtml(userComment)}</p></div></article>` : ""}</div><div class="comment-compose"><input id="comment-input" type="text" maxlength="80" placeholder="Escreva um comentário" aria-label="Comentário"><button type="button" data-action="send-comment" aria-label="Enviar comentário">${icon("arrow")}</button></div></section>`);
}

function renderWallet() {
  return phone(`<section class="wallet-overlay-page">
    <article class="wallet-floating-card"><span class="wallet-watermark">S</span><button class="wallet-close" type="button" data-action="close-wallet" aria-label="Fechar carteira">${icon("close", 27)}</button><small>MINHA CARTEIRA</small><div class="wallet-card-label"><strong>Saldo</strong><button type="button" data-action="toggle-wallet-balance" aria-label="Mostrar ou ocultar saldo">${icon("eye", 21)}</button></div><div class="wallet-cash-balance">${state.walletBalanceVisible ? "R$ 5,02" : "R$ ••••"}</div><button class="wallet-access" type="button" data-action="wallet-detail">Acessar carteira</button></article>
    <div class="wallet-shortcuts" aria-label="Ações da carteira"><button type="button" data-action="prototype-notice" data-message="Saque via PIX representado apenas visualmente"><span>${icon("wallet", 27)}</span><strong>Sacar via<br>PIX</strong></button><button type="button" data-action="prototype-notice" data-message="Leitura de cupom fiscal simulada"><span>${icon("receipt", 27)}</span><strong>Ler Cupom<br>Fiscal</strong></button><button type="button" data-action="prototype-notice" data-message="Vale energia representado apenas visualmente"><span>${icon("bulb", 28)}</span><strong>Resgatar Vale<br>Energia</strong></button><button type="button" data-action="prototype-notice" data-message="Pagamento de conta representado apenas visualmente"><span>${icon("bolt", 28)}</span><strong>Pagar Conta<br>de Luz</strong></button></div>
    <button class="wallet-points-preview" type="button" data-action="wallet-detail"><span>${icon("badge", 23)}</span><div><small>SALDO EM RECOMPENSAS</small><strong>${state.points} Pontos Soul</strong><p>${state.rewardIssued ? `Última entrada: +${campaign.rewardPoints} pela meta da campanha SoulMove` : "Veja suas últimas movimentações"}</p></div>${icon("chevron", 18)}</button>
  </section>`, { active: "feed" });
}

function renderWalletDetail() {
  return innerScreen("Minha carteira", `<section class="page wallet-detail-page"><div class="wallet-points-balance"><span>${icon("badge", 25)}</span><div><small>SALDO EM RECOMPENSAS</small><strong>${state.points} <em>Pontos Soul</em></strong></div><button type="button" data-action="marketplace">Usar pontos</button></div><div class="wallet-money-summary"><span>Saldo para saque</span><strong>${state.walletBalanceVisible ? "R$ 5,02" : "R$ ••••"}</strong><button type="button" data-action="toggle-wallet-balance" aria-label="Mostrar ou ocultar saldo">${icon("eye", 19)}</button></div><h2 class="section-heading">Movimentações</h2><div class="wallet-history">${state.rewardIssued ? `<article class="wallet-entry highlight"><span>${icon("leaf")}</span><div><strong>Meta da campanha concluída</strong><small>Hoje • ${campaign.title}</small></div><b>+${campaign.rewardPoints}</b></article>` : ""}<article class="wallet-entry"><span>${icon("badge")}</span><div><strong>Missão semanal</strong><small>Ontem • Comunidade</small></div><b>+8</b></article><article class="wallet-entry debit"><span>${icon("bag")}</span><div><strong>Benefício utilizado</strong><small>03 set • Marketplace</small></div><b>-10</b></article><article class="wallet-entry"><span>${icon("heart")}</span><div><strong>Engajamento no Clipz</strong><small>01 set • Recompensa</small></div><b>+4</b></article></div>${state.rewardIssued ? `<div class="wallet-credit-note">${icon("check")} O crédito de +${campaign.rewardPoints} Pontos Soul foi registrado nesta demonstração.</div>` : ""}</section>`);
}

const marketplaceStores = [
  { name: "Move+", initials: "M+", cashback: "2,0% de volta", category: "Mobilidade", className: "move" },
  { name: "Vida Farma", initials: "VF", cashback: "2,5% de volta", category: "Bem-estar", className: "health" },
  { name: "Casa Verde", initials: "CV", cashback: "3,0% de volta", category: "Casa", className: "home" },
  { name: "Estilo Livre", initials: "EL", cashback: "4,0% de volta", category: "Acessórios", className: "style" },
  { name: "Clube Urbano", initials: "CU", cashback: "1,5% de volta", category: "Acessórios", className: "urban" },
  { name: "Auto Bem", initials: "AB", cashback: "2,3% de volta", category: "Automotivo", className: "auto" },
  { name: "Pet & Cia", initials: "PC", cashback: "2,0% de volta", category: "Casa", className: "pet" },
  { name: "Bem Natural", initials: "BN", cashback: "4,2% de volta", category: "Bem-estar", className: "natural" },
];

function filteredMarketplaceStores() {
  const query = state.marketplaceQuery.trim().toLocaleLowerCase("pt-BR");
  return marketplaceStores.filter(store => (state.marketplaceCategory === "Todos" || store.category === state.marketplaceCategory) && (!query || store.name.toLocaleLowerCase("pt-BR").includes(query)));
}

function renderMarketplace() {
  const stores = filteredMarketplaceStores();
  const categories = ["Todos", "Acessórios", "Automotivo", "Mobilidade", "Bem-estar", "Casa"];
  return innerScreen("Marketplace", `<section class="marketplace-page"><div class="marketplace-webbar"><span class="marketplace-logo">soul <b>UP</b></span><span class="marketplace-cash">R$ 5,02</span><span class="marketplace-profile">${icon("user", 18)}</span></div><div class="market-search"><input id="market-search-input" type="search" maxlength="30" value="${escapeHtml(state.marketplaceQuery)}" placeholder="Busque por lojas aqui" aria-label="Buscar lojas"><button type="button" data-action="apply-market-search" aria-label="Buscar">${icon("search", 19)}</button></div>
    <button class="marketplace-hero" type="button" data-action="open-campaign"><img src="./assets/soulmove-campaign.webp" alt="Campanha demonstrativa SoulMove"><span><small>CAMPANHA SOULMOVE</small><strong>${campaign.title}</strong><p>Complete a meta da campanha e receba +${campaign.rewardPoints} Pontos Soul.</p></span></button><div class="marketplace-dots"><b></b><i></i><i></i><i></i></div>
    <div class="marketplace-content"><header class="marketplace-list-heading"><div><small>CATÁLOGO DEMONSTRATIVO</small><h1>Lojas com cashback</h1></div><button type="button" data-action="prototype-notice" data-message="Ordenação representada visualmente">Ordenar por ${icon("sliders", 16)}</button></header><div class="market-categories">${categories.map(category => `<button class="${state.marketplaceCategory === category ? "active" : ""}" type="button" data-action="select-market-category" data-category="${category}">${category}</button>`).join("")}</div>
      ${stores.length ? `<div class="market-store-grid">${stores.map(store => `<button class="market-store-card" type="button" data-action="prototype-notice" data-message="Loja demonstrativa: ${store.name}"><span class="store-logo ${store.className}">${store.initials}</span><strong>${store.name}</strong><small>${store.cashback}</small></button>`).join("")}</div><div class="market-list-progress"><span>Mostrando ${stores.length} de ${marketplaceStores.length} lojas demonstrativas</span><div><i style="width:${Math.max(18, Math.round(stores.length / marketplaceStores.length * 100))}%"></i></div><button type="button" data-action="load-market-stores">Ver mais lojas</button></div>` : `<div class="market-empty">${icon("search", 28)}<strong>Nenhuma loja encontrada</strong><p>Tente outro nome ou selecione a categoria “Todos”.</p><button type="button" data-action="clear-market-search">Limpar busca</button></div>`}
      <section class="market-offers"><h2>As melhores ofertas estão aqui!</h2><p>Use cupons de desconto e ainda acompanhe os benefícios da campanha.</p><div class="market-coupon-row"><button class="market-coupon campaign" type="button" data-action="${state.benefitUnlocked ? "benefit" : "open-campaign"}"><span class="store-logo viva">V</span><small>${campaign.sponsor} • SOULMOVE</small><strong>Ganhe 15% OFF</strong><p>${state.benefitUnlocked ? `Cupom ${campaign.coupon} desbloqueado.` : "Conclua a missão para liberar a oferta."}</p><b>${state.benefitUnlocked ? "Ver cupom" : "Conhecer missão"}</b></button><button class="market-coupon" type="button" data-action="prototype-notice" data-message="Cupom demonstrativo"><span class="store-logo natural">BN</span><small>BEM NATURAL</small><strong>Ganhe 8% OFF</strong><p>Oferta demonstrativa por tempo limitado.</p><b>Ver oferta</b></button></div></section>
      <div class="market-faq"><h2>Dúvidas frequentes</h2><button type="button" data-action="prototype-notice" data-message="Resposta demonstrativa: o cashback aparece após a confirmação da compra">Em quanto tempo recebo meu cashback? <span>+</span></button><button type="button" data-action="prototype-notice" data-message="Resposta demonstrativa: cupons e cashback dependem das regras da oferta">Também ganho cashback ao usar cupom? <span>+</span></button></div><div class="privacy-note">Lojas, ofertas e valores desta tela são demonstrativos e não representam parcerias ou condições comerciais reais.</div>
    </div></section>`);
}

function metrics() {
  return {
    reached: baseMetrics.reached,
    participants: baseMetrics.participants + (state.joined ? 1 : 0),
    started: baseMetrics.started + (state.journeyStarted ? 1 : 0),
    validated: baseMetrics.validated + (state.validated ? 1 : 0),
    benefits: baseMetrics.benefits + (state.benefitUnlocked ? 1 : 0),
    offerVisits: baseMetrics.offerVisits + (state.benefitUnlocked ? 1 : 0),
    conversions: baseMetrics.conversions + (state.conversion ? 1 : 0),
    rankingViews: baseMetrics.rankingViews + (state.rankingViewed ? 1 : 0),
    shares: baseMetrics.shares + (state.sharePublished ? 1 : 0),
    visitsFromShares: baseMetrics.visitsFromShares,
  };
}

function pct(value, max) { return Math.max(4, Math.round((value / max) * 100)); }

function renderBusiness() {
  const m = metrics();
  const delta = state.conversion ? "Nova conversão da demonstração registrada" : state.sharePublished ? `Novo cartão compartilhado em ${state.shareChannel}` : state.rankingViewed ? "Nova visualização do ranking registrada" : "Conclua a jornada no app para atualizar este painel";
  return `<div class="business-stage"><section class="business-app" aria-label="Painel SoulBusiness">
    <aside class="business-sidebar"><div class="business-brand">soul<span>business</span></div><nav class="business-nav"><button class="active" type="button">Visão geral</button><button type="button">Campanhas</button><button type="button">Resultados</button></nav></aside>
    <main class="business-main"><header class="business-heading"><div><h1>${campaign.title}</h1><p>${campaign.sponsor} • campanha demonstrativa</p></div><span class="demo-badge">Dados simulados</span></header>
      <section class="metric-grid"><article class="metric-card"><span>Participantes</span><strong>${m.participants}</strong><small>${state.joined ? "+1 nesta demonstração" : "adesões à campanha"}</small></article><article class="metric-card"><span>Jornadas validadas</span><strong>${m.validated}</strong><small>${state.validated ? "+1 nesta demonstração" : "eventos aprovados"}</small></article><article class="metric-card"><span>Benefícios liberados</span><strong>${m.benefits}</strong><small>ofertas desbloqueadas</small></article><article class="metric-card"><span>Conversões atribuídas</span><strong>${m.conversions}</strong><small>${state.conversion ? "+1 nesta demonstração" : "links, cupons ou leitura fiscal"}</small></article></section>
      <section class="dashboard-grid"><article class="dashboard-panel"><h2>Funil da campanha</h2><div class="funnel-row"><span>Alcance</span><div class="funnel-track"><div class="funnel-value" style="width:100%"></div></div><span class="funnel-number">${m.reached}</span></div><div class="funnel-row"><span>Participantes</span><div class="funnel-track"><div class="funnel-value" style="width:${pct(m.participants,m.reached)}%"></div></div><span class="funnel-number">${m.participants}</span></div><div class="funnel-row"><span>Iniciadas</span><div class="funnel-track"><div class="funnel-value" style="width:${pct(m.started,m.reached)}%"></div></div><span class="funnel-number">${m.started}</span></div><div class="funnel-row"><span>Validadas</span><div class="funnel-track"><div class="funnel-value" style="width:${pct(m.validated,m.reached)}%"></div></div><span class="funnel-number">${m.validated}</span></div><div class="funnel-row"><span>Conversões</span><div class="funnel-track"><div class="funnel-value" style="width:${pct(m.conversions,m.reached)}%"></div></div><span class="funnel-number">${m.conversions}</span></div></article>
        <article class="dashboard-panel"><h2>Participação agregada por zona</h2><div class="zone-row"><div class="zone-head"><span>Zona Leste</span><strong>36%</strong></div><div class="zone-bar"><span style="width:36%"></span></div></div><div class="zone-row"><div class="zone-head"><span>Zona Sul</span><strong>28%</strong></div><div class="zone-bar"><span style="width:28%"></span></div></div><div class="zone-row"><div class="zone-head"><span>Zona Norte</span><strong>21%</strong></div><div class="zone-bar"><span style="width:21%"></span></div></div><div class="zone-row"><div class="zone-head"><span>Zona Oeste e Centro</span><strong>15%</strong></div><div class="zone-bar"><span style="width:15%"></span></div></div></article></section>
      <article class="dashboard-panel social-panel"><div><h2>Engajamento social</h2><p>Interações agregadas geradas pela comunidade SoulMove.</p></div><div class="social-metrics"><div><span>Visualizações do ranking</span><strong>${m.rankingViews}</strong><small>${state.rankingViewed ? "+1 nesta demonstração" : "interesse na campanha"}</small></div><div><span>Cartões compartilhados</span><strong>${m.shares}</strong><small>${state.sharePublished ? "+1 nesta demonstração" : "Clipz, comunidades e outros apps"}</small></div><div><span>Acessos por compartilhamento</span><strong>${m.visitsFromShares}</strong><small>atribuição agregada</small></div></div></article>
      <div class="privacy-banner"><strong>Privacidade por design:</strong> este painel apresenta indicadores agregados. O patrocinador não acessa nomes, coordenadas, trajetos individuais nem fotos ou vídeos opcionais.</div><div class="event-log"><strong>Evento da demonstração:</strong> ${delta}.</div>
    </main></section></div>`;
}

function renderUser() {
  const renderers = {
    feed: renderFeed,
    communities: renderCommunities,
    clipz: renderClipz,
    story: renderStory,
    campaign: renderCampaignDetail,
    consent: renderConsent,
    ready: renderReady,
    journey: renderJourney,
    proof: renderProof,
    validation: renderValidation,
    result: renderResult,
    ranking: renderRanking,
    "ranking-rules": renderRankingRules,
    share: renderShare,
    benefit: renderBenefit,
    offer: renderOffer,
    conversion: renderConversion,
    comments: renderComments,
    wallet: renderWallet,
    "wallet-detail": renderWalletDetail,
    marketplace: renderMarketplace,
  };
  return (renderers[state.screen] || renderFeed)();
}

function render() {
  document.querySelectorAll("[data-perspective]").forEach(button => button.classList.toggle("active", button.dataset.perspective === state.perspective));
  root.innerHTML = state.perspective === "business" ? renderBusiness() : renderUser();
  if (state.perspective === "user" && state.screen === "journey") runJourneySimulation();
}

function navigate(screen) {
  clearJourneyTimers();
  state.screen = screen;
  state.perspective = "user";
  render();
}

function runJourneySimulation() {
  clearJourneyTimers();
  const steps = [25, 50, 75, 100];
  steps.forEach((progress, index) => {
    const timer = setTimeout(() => {
      state.journeyProgress = progress;
      const track = document.querySelector("#track-progress");
      if (!track) return;
      track.style.width = `${progress}%`;
      const completed = progress / 25;
      document.querySelectorAll("[data-checkpoint]").forEach((point, pointIndex) => point.classList.toggle("done", pointIndex < completed));
      document.querySelector("#journey-time").textContent = `00:0${index + 2}`;
      document.querySelector("#journey-distance").textContent = `${(campaign.distanceKm * progress / 100).toFixed(1).replace(".", ",")} km`;
      document.querySelector("#journey-checkpoints").textContent = `${completed}/4`;
      if (progress === 100) document.querySelector("#finish-journey").disabled = false;
    }, 650 * (index + 1));
    journeyTimers.push(timer);
  });
}

function toggleStateList(key, id) {
  const values = state[key];
  state[key] = values.includes(id) ? values.filter(value => value !== id) : [...values, id];
  render();
}

function beginValidation() {
  navigate("validation");
  journeyTimers.push(setTimeout(() => {
    state.validated = true;
    state.benefitUnlocked = true;
    state.points = 520 + campaign.rewardPoints;
    state.screen = "result";
    render();
  }, 1800));
}

document.addEventListener("click", event => {
  const perspective = event.target.closest("[data-perspective]");
  if (perspective) {
    clearJourneyTimers();
    state.perspective = perspective.dataset.perspective;
    render();
    return;
  }

  const nav = event.target.closest("[data-nav]");
  if (nav) { navigate(nav.dataset.nav); return; }

  const actionElement = event.target.closest("[data-action]");
  if (!actionElement || actionElement.disabled) return;
  const action = actionElement.dataset.action;

  const actions = {
    "open-story": () => { state.activeStory = actionElement.dataset.story || "campaign"; navigate("story"); },
    "close-story": () => navigate("feed"),
    "open-campaign": () => navigate("campaign"),
    communities: () => navigate("communities"),
    back: () => {
      if (state.screen === "comments") { navigate(state.commentsReturn || "feed"); return; }
      if (state.screen === "wallet" || state.screen === "marketplace") { navigate(state.overlayReturn || "feed"); return; }
      if (state.screen === "wallet-detail") { navigate(state.overlayReturn === "result" ? "result" : "wallet"); return; }
      const history = { story: "feed", campaign: "feed", consent: "campaign", ready: "consent", proof: "journey", ranking: state.validated ? "result" : "campaign", "ranking-rules": "ranking", share: "result", benefit: state.validated ? "result" : "feed", offer: "benefit" };
      navigate(history[state.screen] || "feed");
    },
    join: () => { state.joined = true; navigate(state.consentRules && state.consentLocation ? "ready" : "consent"); },
    "consent-continue": () => navigate("ready"),
    "start-journey": () => { state.journeyStarted = true; state.journeyProgress = 0; navigate("journey"); },
    "finish-journey": () => navigate("proof"),
    "select-proof": () => { state.proofType = actionElement.dataset.proof || "Foto"; render(); },
    "remove-proof": () => { state.proofType = ""; render(); },
    "submit-proof": beginValidation,
    ranking: () => { state.rankingViewed = true; navigate("ranking"); },
    "ranking-rules": () => navigate("ranking-rules"),
    share: () => navigate("share"),
    "publish-share": () => { state.sharePublished = true; state.shareChannel = actionElement.dataset.channel || "Clipz"; showToast(`Cartão compartilhado em ${state.shareChannel}`); setTimeout(() => navigate("result"), 700); },
    wallet: () => { if (state.screen !== "wallet") state.walletReturn = state.screen; navigate("wallet"); },
    "close-wallet": () => navigate(state.walletReturn || "feed"),
    "wallet-detail": () => { if (state.screen !== "wallet") state.walletReturn = state.screen; navigate("wallet-detail"); },
    "toggle-wallet-balance": () => { state.walletBalanceVisible = !state.walletBalanceVisible; render(); },
    marketplace: () => { if (state.screen !== "marketplace") state.marketplaceReturn = state.screen; navigate("marketplace"); },
    "apply-market-search": () => { const input = document.querySelector("#market-search-input"); state.marketplaceQuery = input?.value || ""; render(); },
    "clear-market-search": () => { state.marketplaceQuery = ""; state.marketplaceCategory = "Todos"; render(); },
    "select-market-category": () => { state.marketplaceCategory = actionElement.dataset.category || "Todos"; render(); },
    "load-market-stores": () => showToast("Catálogo demonstrativo exibido por completo"),
    benefit: () => navigate(state.benefitUnlocked ? "benefit" : "campaign"),
    "activate-offer": () => { state.benefitUnlocked = true; navigate("offer"); },
    "copy-coupon": () => {
      if (navigator.clipboard) navigator.clipboard.writeText(campaign.coupon).catch(() => {});
      showToast("Cupom copiado");
    },
    "register-conversion": () => { state.conversion = true; navigate("conversion"); },
    "toggle-post-like": () => toggleStateList("likedPosts", actionElement.dataset.id),
    "toggle-clipz-like": () => toggleStateList("likedClipz", actionElement.dataset.id),
    "open-comments": () => { state.activePost = actionElement.dataset.id || "campaign"; state.commentsReturn = state.screen; navigate("comments"); },
    "send-comment": () => {
      const input = document.querySelector("#comment-input");
      const value = input?.value.trim();
      if (!value) { showToast("Escreva um comentário primeiro"); return; }
      state.userComments[state.activePost] = value;
      render();
      showToast("Comentário adicionado à demonstração");
    },
    "share-post": () => showToast("Opções de compartilhamento abertas na demonstração"),
    "prototype-notice": () => showToast(actionElement.dataset.message || "Interação demonstrativa"),
    "open-business": () => { clearJourneyTimers(); state.perspective = "business"; render(); },
    reset: () => { clearJourneyTimers(); state = initialState(); render(); showToast("Demonstração reiniciada"); },
  };

  if (actions[action]) actions[action]();
});

document.addEventListener("change", event => {
  const consent = event.target.closest("[data-consent]");
  const preference = event.target.closest("[data-preference]");
  if (!consent && !preference) return;
  if (consent?.dataset.consent === "location") state.consentLocation = consent.checked;
  if (consent?.dataset.consent === "rules") state.consentRules = consent.checked;
  if (preference?.dataset.preference === "ranking") {
    state.rankingVisible = preference.checked;
    showToast(preference.checked ? "Sua posição está visível" : "Sua posição foi ocultada");
  }
  render();
});
