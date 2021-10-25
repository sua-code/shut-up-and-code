# Typeorm Essentials

## Use Case


## Create a Connection

```typescript
async function createSqliteConnection() {
  const connection = await createConnection({
    type: "sqlite",
    database: "./db.sqlite",
    name: "default",
    synchronize: true,
    entities: [Company],
  });

  return connection;
}
```

## Define Entity

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "company" })
export class Company {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "name" })
  name: string;
}
```

## Create Entity

```typescript
  const companyRepo = conn.getRepository(Company);

  // Create a new instance of a Company
  const githubCompany = companyRepo.create({
    name: "Github",
  });

  // Save the company to the database!
  const savedGithubCompany = await companyRepo.save(githubCompany);
  ```
