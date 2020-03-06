pragma solidity ^0.5.12;
contract ForceSend {
    function go(address payable victim) external payable {
        selfdestruct(victim);
    }
}