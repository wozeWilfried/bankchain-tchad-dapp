export const DEMO_USERS = [
  { name: "Alice M.", email: "alice@bankchain.td", address: "0x1234567890abcdef1234567890abcdef12345678", role: "Utilisatrice" },
  { name: "Bob K.", email: "bob@bankchain.td", address: "0xabcdef1234567890abcdef1234567890abcdef12", role: "Commerçant" },
  { name: "Fatima D.", email: "fatima@bankchain.td", address: "0x7890abcdef1234567890abcdef1234567890abcd", role: "Investisseur" },
  { name: "Admin", email: "admin@bankchain.td", address: "0x7E81F2eb2e3B280502130086fE16f54351084589", role: "Administrateur" },
];

export async function fetchDemoBalances(provider) {
  if (!provider) return DEMO_USERS;
  const contract = new window.ethers.Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ["function getBalance(address) view returns (uint256)"],
    provider
  );
  const users = await Promise.all(
    DEMO_USERS.map(async (u) => {
      let balance = "0";
      try {
        const bal = await contract.getBalance(u.address);
        balance = window.ethers.formatEther(bal);
      } catch {}
      return { ...u, balance };
    })
  );
  return users;
}
