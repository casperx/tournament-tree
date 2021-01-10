
const wrapper = document.querySelector('#svg');

wrapper.setAttribute('width', containerWidth);
wrapper.setAttribute('height', containerHeight);

const container = svgNode('g');

container.setAttribute('shape-rendering', 'crispEdges');

wrapper.appendChild(container);

// calculate derived constant
const firstRoundOffsetVert =
	firstRoundOffsetTop +
	firstRoundOffsetBottom;

const teamSpaceHor = lineOutLength + lineInLength;

const halfTeamHeight = teamHeight / 2;
const halfBridgeVariantLength = bridgeVariantLength / 2;

const drawTree = (container, teams, rounds) => {
	// calculate derived variable
	const availHeight = containerHeight - firstRoundOffsetVert;

	const teamSpaceVert = availHeight / teams.length;
	const halfTeamSpaceVert = teamSpaceVert / 2;

	const drawTeam = (left, top, teamKey, i) => {
		const teamName = teams[teamKey];

		const teamRectNode = svgRect(
			left,
			top - halfTeamHeight,
			teamWidth,
			teamHeight
		);

		teamRectNode.setAttribute('fill', 'white');
		teamRectNode.setAttribute('stroke', 'orange');
		teamRectNode.setAttribute('stroke-width', 2);

		container.appendChild(teamRectNode);

		const teamNameTextNode = svgText(
			teamName + ' round ' + i,
			left + teamNameLeft,
			top,
			'start',
			'middle'
		);

		teamNameTextNode.setAttribute('fill', 'black');

		container.appendChild(teamNameTextNode);
	};

	const computed = [[]];
	const firstComputed = computed[0];

	for (const i of teams.keys()) {
		const teamTop = firstRoundOffsetTop + teamSpaceVert * i;
		const teamTopShimmed = teamTop + halfTeamSpaceVert;

		drawTeam(fistRoundOffsetLeft, teamTopShimmed, i, 0);

		const newComputedItem = {key: i, top: teamTopShimmed};
		firstComputed.push(newComputedItem);
	}

	for (const [roundIndex, round] of rounds.entries()) {
		const lastComputed = computed[roundIndex];

		const roundLeft = (teamSpaceHor + teamWidth) * roundIndex;
		const roundLeftShimmed =
			fistRoundOffsetLeft +
			teamWidth +
			roundLeft;

		const newComputed = [];

		// scan for non consecutive team in race group
		const nonConsecutive = round.some(
			(v) => {
				const {teams} = v;
				return teams.some(
					(v, i, a) => {
						const d = v - a[i - 1];
						return i && Math.abs(d) > 1;
					}
				);
			}
		);

		// generate bridge variant if non consecutive team was founded
		const roundMax = round.length - 1;

		const bridgeVariants = round.map(
			nonConsecutive ? (v, i) => bridgeVariantLength * (i / roundMax) - halfBridgeVariantLength : () => 0
		);

		for (const i of round.keys()) {
			const {teams, pass, win} = round[i];

			const bridgeLeft = roundLeftShimmed + lineOutLength + bridgeVariants[i];

			// draw line from right edge of team box to bridge
			for (const [i, index] of teams.entries()) {
				const {top} = lastComputed[index];

				const lineOutLineNode = svgLine(
					roundLeftShimmed,
					top,
					bridgeLeft,
					top
				);
				lineOutLineNode.setAttribute('stroke', pass || i === win ? winLinkColor : teamLinkColor);
				lineOutLineNode.setAttribute('stroke-width', 2);

				container.appendChild(lineOutLineNode);
			}

			const drawTeamNext = (top, key) => {
				const lineInLineNode = svgLine(
					bridgeLeft,
					top,
					roundLeftShimmed + teamSpaceHor,
					top
				);

				lineInLineNode.setAttribute('stroke', winLinkColor);
				lineInLineNode.setAttribute('stroke-width', 2);

				container.appendChild(lineInLineNode);

				drawTeam(roundLeftShimmed + teamSpaceHor, top, key, roundIndex + 1);
			};

			if (pass) {
				// pass every teams in group as-is
				for (const i of teams) {
					const computedItem = lastComputed[i];
					const {key, top} = computedItem;

					drawTeamNext(top, key);

					newComputed.push(computedItem);
				}
			} else {
				const teamsTop = teams.map(
					(index) => {
						const {top} = lastComputed[index];
						return top;
					}
				);

				const minTop = Math.min(...teamsTop);
				const maxTop = Math.max(...teamsTop);
				const topBetween = minTop + (maxTop - minTop) / 2;

				const bridgeLineNode = svgLine(
					bridgeLeft,
					minTop,
					bridgeLeft,
					maxTop
				);

				bridgeLineNode.setAttribute('stroke', teamLinkColor);
				bridgeLineNode.setAttribute('stroke-width', 2);

				container.appendChild(bridgeLineNode);

				const newComputedItem = {key: -1, top: topBetween};

				if (win !== undefined) {
					const winTeam = teams[win];
					const {key, top} = lastComputed[winTeam];

					const bridgeWinNode = svgLine(
						bridgeLeft,
						topBetween,
						bridgeLeft,
						top
					);
	
					bridgeWinNode.setAttribute('stroke', winLinkColor);
					bridgeWinNode.setAttribute('stroke-width', 2);
	
					container.appendChild(bridgeWinNode);

					newComputedItem.key = key;

					drawTeamNext(topBetween, key);
				}

				newComputed.push(newComputedItem);
			}
		}

		computed.push(newComputed);
	}
};

drawTree(container, teams, rounds);
