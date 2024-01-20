import { PaymentOption } from "@superfluid-finance/widget";

const paymentOptions: PaymentOption[] = [
  {
    chainId: 11155111,
    receiverAddress: "0xDFf3b2abf15830d728576110F853aB3B3f72E739",
    superToken: {
      address: "0x9Ce2062b085A2268E8d769fFC040f6692315fd2c",
    },
    flowRate: {
      amountEther: "30",
      period: "month",
    },
  },
  {
    chainId: 421613,
    receiverAddress: "0xDFf3b2abf15830d728576110F853aB3B3f72E739",
    superToken: {
      address: "0x675BE78Ed16cabe47f6d9f816D615c3d6D740508",
    },
    flowRate: {
      amountEther: "30",
      period: "month",
    },
  },
  {
    chainId: 11155111,
    receiverAddress: "0xDFf3b2abf15830d728576110F853aB3B3f72E739",
    superToken: {
      address: "0x9Ce2062b085A2268E8d769fFC040f6692315fd2c",
    },
    flowRate: {
      amountEther: "15",
      period: "month",
    },
  }
];

export default paymentOptions;