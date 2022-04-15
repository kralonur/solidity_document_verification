// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

library SignatureSet {
    struct Sign {
        address signer;
        uint256 timestamp;
    }

    struct SignSet {
        // Storage of set values
        Sign[] _values;
        // Position of the value in the `values` array, plus 1 because index 0
        // means a value is not in the set.
        mapping(address => uint256) _indexes;
    }

    function add(SignSet storage self, Sign memory value) internal returns (bool) {
        if (!contains(self, value.signer)) {
            self._values.push(value);
            self._indexes[value.signer] = self._values.length;
            return true;
        } else {
            return false;
        }
    }

    function remove(SignSet storage self, address signer) internal returns (bool) {
        // We read and store the value's index to prevent multiple reads from the same storage slot
        uint256 valueIndex = self._indexes[signer];

        if (valueIndex != 0) {
            // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 toDeleteIndex = valueIndex - 1;
            uint256 lastIndex = self._values.length - 1;

            if (lastIndex != toDeleteIndex) {
                Sign memory lastvalue = self._values[lastIndex];

                // Move the last value to the index where the value to delete is
                self._values[toDeleteIndex] = lastvalue;
                // Update the index for the moved value
                self._indexes[lastvalue.signer] = valueIndex; // Replace lastvalue's index to valueIndex
            }

            // Delete the slot where the moved value was stored
            self._values.pop();

            // Delete the index for the deleted slot
            delete self._indexes[signer];

            return true;
        } else {
            return false;
        }
    }

    function contains(SignSet storage self, address signer) internal view returns (bool) {
        return self._indexes[signer] != 0;
    }

    function indexOf(SignSet storage self, address signer) internal view returns (uint256) {
        return self._indexes[signer];
    }

    function length(SignSet storage self) internal view returns (uint256) {
        return self._values.length;
    }

    function at(SignSet storage self, uint256 index) internal view returns (Sign memory) {
        return self._values[index];
    }

    function values(SignSet storage self) internal view returns (Sign[] memory) {
        return self._values;
    }
}
