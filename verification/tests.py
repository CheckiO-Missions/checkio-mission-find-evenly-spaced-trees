"""
TESTS is a dict with all of your tests.
Keys for this will be the categories' names.
Each test is a dict with
    "input" -- input data for a user function
    "answer" -- your right answer
    "explanation" -- not necessarily a key, it's used for an additional info in animation.
"""

from random import sample
from collections import defaultdict
from typing import Optional


def find_evenly_spaced_trees(trees: list[int]) -> Optional[list[list[int]]]:
    def get_consecutive_numbers(numbers: list[int]) -> list[int]:
        temp_numbers = []
        max_numbers = []
        for n in numbers:
            if not temp_numbers or temp_numbers[-1] + 1 == n:
                temp_numbers.append(n)
            else:
                max_numbers = max(max_numbers, temp_numbers, key=len)
                temp_numbers = [n]
        return max(max_numbers, temp_numbers, key=len)

    answers = []
    for space in range(1, (max(trees) - min(trees)) // 2 + 1):
        dm_dict = defaultdict(list)
        for position in trees:
            q, r = divmod(position, space)
            dm_dict[r].append(q)
        answers += [[n * space + k for n in get_consecutive_numbers(v)] for k, v in dm_dict.items()]
    len_dict = defaultdict(list)
    for a in answers:
        len_dict[len(a)].append(a)
    max_answers = list(reversed(len_dict[max(len_dict.keys())]))
    if len(max_answers[0]) > 2:
        return max_answers


def make_basic_tests(*inputs):
    for inp in inputs:
        answers = find_evenly_spaced_trees(inp)
        yield {
            'input': [inp],
            'answer': answers and len(answers[0]),
            'explanation': answers or [],
        }


def make_random_tests(*inputs):
    for inp in inputs:
        input_trees = sorted(sample(range(100), inp))
        answers = find_evenly_spaced_trees(input_trees)
        yield {
            'input': [input_trees],
            'answer': answers and len(answers[0]),
            'explanation': answers or [],
        }


TESTS = {
    "Basics": list(make_basic_tests(
        [0, 2, 4, 7],
        [0, 2, 3, 5, 9],
        [0, 3, 6, 8, 11, 14, 17],
        [0, 4, 6, 8, 12, 16, 18],
        [0, 2, 5, 10, 11, 15, 19, 20, 22, 25],
    )),
    "Randoms": list(make_random_tests(5, 10, 15, 20, 30, 40, 50, 60, 70, 80)),
}
