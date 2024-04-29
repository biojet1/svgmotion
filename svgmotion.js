#!/usr/bin/env node

import('svgmotion/main')
    .then(({ main }) => main())
    .catch((err) => {
        throw err;
    });