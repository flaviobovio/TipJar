# 🪙 TipJar - Smart Contract

Este proyecto implementa un contrato inteligente de "TipJar" donde los usuarios pueden dejar propinas (ETH) con un mensaje, y el propietario puede retirarlas.

## 📦 Requisitos

- Node.js >= 18
- npm o yarn
- Hardhat
- Cuenta de Alchemy
- Cuenta en Sepolia con ETH (usa [Sepolia Faucet](https://sepoliafaucet.com/))

---

## ⚙️ Instalación

```bash
git clone https://github.com/flaviobovio/TipJar
cd tipjar
npm install
```

---

## 🔧 Configuración

1. Configurar variables de entorno con `npx hardhat vars set`.

```
ALCHEMY_API_KEY=tu_alchemy_key
SEPOLIA_PRIVATE_KEY=tu_clave_privada
ETHERSCAN_API_KEY=tu_etherscan_key
```

2. Configurar la red Sepolia en `hardhat.config.ts`:

```ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY!],
    },
  },
};

export default config;
```

---

## 🔨 Compilar el contrato

```bash
npx hardhat compile
```

---

## 🧪 Testear

Ejecutar los tests en `test/`:

```bash
npx hardhat test
```

---

## 🚀 Desplegar en Sepolia

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

El script desplegará el contrato y mostrará su dirección <address_del_contrato>g

En scripts/interactTipJar.ts
Modificar (26)

const tipJarAddress = "<address_del_contrato>"

---

## 🧾 Scripts interactivos

Ejecutar el script para interactuar con el contrato TipJar:

```bash
npx hardhat run scripts/interactTipJar.ts
```

Se abrirá un menú donde podrás:

- Ver el dueño del contrato
- Ver el balance actual
- Enviar propinas con mensaje
- Listar propinas
- Retirar fondos (solo dueño)

---



