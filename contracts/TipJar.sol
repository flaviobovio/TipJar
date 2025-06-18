// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title TipJar
 * @dev Smart contract to send tips to contract owner
 * Author: Flavio Bovio
 */
contract TipJar {

    address payable public owner;

    struct Tip {
        address sender;
        uint256 amount;
        string message;
    }

    Tip[] public tips;

    event NewTip(address indexed from, uint amount, string message);

    modifier onlyOwner() {
        require(msg.sender == owner, "No autorizado: no es el propietario");
        _;
    }






    /**
     * @dev Constructor del contrato
     */
    constructor() {
        // Asign contract deployment address to owner
        owner = payable(msg.sender);

    }


    function tip(string memory message) public payable  {
        // Validar que la cantidad que la propina sea depositada sea mayor a cero
        require(msg.value > 0, "Monto propina no valido");
        // Registrar la propina
        tips.push(Tip(msg.sender, msg.value, message));
        // Emitir el evento tip
        emit NewTip(msg.sender, msg.value, message);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTip(uint index) public view returns (address, uint256, string memory) {
        require(index < tips.length, "Indice invalido");
        Tip memory t = tips[index];
        return (t.sender, t.amount, t.message);
    }

    function getAllTips() public view returns (Tip[] memory) {
        return tips;
    }



    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No hay fondos para retirar");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transferencia fallida");
    }

}