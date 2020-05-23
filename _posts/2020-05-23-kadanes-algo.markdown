---
layout: post
title:  "Kadane's Algorithm"
date:   2020-05-23 22:00:00 +0000
categories: learning algorithms programming cs
---

**_TL:DR_**   
Kadane's Algorithm explanation with its example use case in the Maximum Subarray problem

**The Problem**  
If you've spent time on Codeforces, Leetcode, or any of the other numerous algorithm coding problem websites, then you're likely to have come across the _Maximum Subarray_ problem. 
```
Given an integer array nums, find the contiguous subarray which   
has the largest sum and return its sum.
```
And other variations such as returning only the largest positive sum or subarrays containing at least one number etc.
So given an array `[-2, 5, 2, -11, 6]` the maximum sub array would be `[5, 2]` totaling `7`.  

The problem was originally proposed back in 1977 by Ulf Grenander a Swedish professor of applied mathematics at Brown University in Rhode Island.  
Ulf had a 2d subarray and wanted to find a rectangular with maximum sum. He was eventually able to derive a O(n^2) solution to the one-dimensional version by using a precomputed table of cumulative sums.  
Then after hearing a seminar of the problem Joseph "Jay" Kadane designed a O(n) algorithm in mere minutes.  

**The Algorithm**  
Kadane's algorithm loops over the array in one pass to find the maximum subarray. The variable `mx` holds the largest subarray total so far in the area up to `i`.  
`curr_max` holds evidently then the current maximum and adding the current item in the array `i` allows us to compare the running maximum to the local subarray maximum in determining which is greater.

```python
def kadane(arr):
    mx = arr[0]
    curr_max = arr[0]
    for i in arr:
        curr_max = max(curr_max + i, i)
        mx = max(mx, curr_max)
    return mx
```

**Applications**   
Coming from an engineering background I used to hearing people ask "when would you use this?" or "what is the need for this?" whenever a new topic was encountered.  
Theoretical mathematics can be diverse and varied and beautiful beyond what anybody could expect. The moment when you see a problem that seems complex but an elegant solution comes sweeping in and shakes your perspective is hard to come by.  
Unfortunately some might say but we live in a real physical world and sometimes need real applications. Kadane's algorithm is one in a plethora of tools that you can add to your toolbox as an engineer or scientist when you encounter a problem. Richard Feynman was a great proponent on this where growing up he read from various calculus books and was able to amaze his cohorts with an answer to a solution that they would have never imagined because they didn't have that tool readily at hand to solve a problem.  
Kadane's algorithm is only a small piece that would slot into larger programmes but some simple examples include:
- Finding the longest running period of profit or loss for a company
- In genomic analysis to identify important segments of protein sequences
- In computer vision, detecting the brightest spots of an image