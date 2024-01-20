// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IMockAggregator {
    event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 updatedAt);
    function latestAnswer() external view returns (int256);
    function getTokenType() external pure returns (uint256);
    function decimals() external pure returns (uint8);
}