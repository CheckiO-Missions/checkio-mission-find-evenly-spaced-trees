requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function find_evenly_spaced_trees_visualization(tgt_node, data) {
            if (!data || !data.ext) {
                return
            }

            /**
             * attr
             */
            const attr = {
                tree: {
                    answer: {
                        'stroke-width': '.7px',
                        'stroke': '#294270',
                        'fill': '#294270',
                    },
                    els: {
                        'stroke-width': '.7px',
                        'stroke': '#82D1F5',
                        'fill': '#82D1F5',
                    },
                },
                scale: {
                    'stroke-width': '.7px',
                    'stroke': '#294270',
                },
                scale_text: {
                    'font-family': 'arial',
                    'font-size': '8px',
                },
                footer_text: {
                    'font-family': 'Times',
                    'font-size': '10px',
                    'stroke-width': '0px',
                    'fill': '#294270',
                },
            }

            /**
             * values
             */
            const trees = data.in[0].values
            const answers = data.ext.explanation
            const max_coord = Math.max(...trees)
            const margin_side = 25
            const margin_top = 15
            const margin_bottom = 28
            const draw_area_px_w = 180
            const draw_area_px_h = 40
            const tree_top = 33
            const tree_stem = 7
            const tree_w = 2.5
            const unit = draw_area_px_w / max_coord
            let answers_idx = 0

            // paper
            const paper = Raphael(tgt_node, draw_area_px_w + margin_side * 2, draw_area_px_h + margin_top + margin_bottom)
            const trees_set = paper.set()

            /**
             * draw scale
             */
            paper.path(['M', margin_side / 2, margin_top + draw_area_px_h, 'h', draw_area_px_w + margin_side]).attr(attr.scale)

            /**
             * (func) draw trees
             */
            function draw_tree(coord, tgt_tree, number_display) {
                const color = tgt_tree ? attr.tree.answer : attr.tree.els
                trees_set.push(
                    paper.path(
                        [
                            'M', unit * coord + margin_side, margin_top,
                            'l', -tree_w, tree_top,
                            'h', tree_w,
                            'v', tree_stem,
                            'v', -tree_stem,
                            'h', tree_w,
                            'z'
                        ]
                    ).attr(color)
                )
                // if (true) {
                if (number_display) {
                    trees_set.push(
                        paper.text(unit * coord + margin_side, margin_top + draw_area_px_h + 6, coord).attr(attr.scale_text)
                    )
                }
                if (answers.length > 1) {
                    trees_set.push(
                        paper.text((draw_area_px_w / 2) + margin_side, margin_top + draw_area_px_h + 19,
                            // 'Click to display another one [' + (answers_idx + 1) + '/ ' + answers.length + ']'
                            '',
                        ).attr(attr.footer_text)
                    )
                }
            }

            /**
             * draw trees
             */
            function draw_trees_main() {
                // all trees
                trees.forEach((coord) => {
                    draw_tree(coord, false, answers.length == 0)
                })
                // target trees
                if (answers.length) {
                    trees.forEach(coord => {
                        let tgt_answer = answers[answers_idx]
                        let space = (tgt_answer[1] - tgt_answer[0]) * unit
                        if (tgt_answer.includes(coord)) {
                            draw_tree(
                                coord,
                                true,
                                space > 10 || [tgt_answer[0], tgt_answer[tgt_answer.length - 1]].includes(coord)
                            )
                        }
                    })
                }
            }

            /*
             * (func) clear trees_set
             */
            function clear_trees_set() {
                while (trees_set.length) {
                    trees_set.pop().remove()
                }
            }

            /**
             * event onclick
             */
            tgt_node.onclick = () => {
                clear_trees_set()
                answers_idx = (answers_idx < answers.length - 1) ? answers_idx + 1 : 0
                draw_trees_main()
            }
            /**
             * init draw
             */
            draw_trees_main()
        }

        var io = new extIO({
            animation: function ($expl, data) {
                find_evenly_spaced_trees_visualization(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
