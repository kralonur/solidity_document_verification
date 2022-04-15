// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

library Search {
    uint256 public constant INVALID_INDEX = 2**256 - 1;

    function indexOf(address[] storage self, address value) internal view returns (uint256) {
        for (uint256 i = 0; i < self.length; i++) {
            if (self[i] == value) return i;
        }
        return INVALID_INDEX;
    }

    function contains(address[] storage self, address value) internal view returns (bool) {
        return indexOf(self, value) != INVALID_INDEX;
    }
}
