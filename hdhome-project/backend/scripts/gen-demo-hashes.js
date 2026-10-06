import bcrypt from 'bcrypt';

const passwords = ['Admin@123', 'Manager@123', 'Technical@123', 'admin123'];
for (const password of passwords) {
  const hash = await bcrypt.hash(password, 10);
  const ok = await bcrypt.compare(password, hash);
  console.log(`${password}\t${ok}\t${hash}`);
}
