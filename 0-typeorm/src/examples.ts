import { createConnection } from "typeorm";
import { Company } from "./entities";

/**
 * Create a single entity using a repository
 */
export async function example0() {
  const conn = await createSqliteConnection();
  const companyRepo = conn.getRepository(Company);

  // Create a new instance of a Company
  const githubCompany = companyRepo.create({
    name: "Github",
  });

  // Save the company to the database!
  const savedGithubCompany = await companyRepo.save(githubCompany);
}

/**
 * Create and save multiple entities
 */
export async function example1() {
  const conn = await createSqliteConnection();
  const companyRepo = conn.getRepository(Company);

  // Create multiple instances at once
  const companiesToSave = companyRepo.create([
    {
      name: "Github",
    },
    {
      name: "Gitlab",
    },
  ]);

  // Save the company to the database!
  const savedCompanies = await companyRepo.save(companiesToSave);
  savedCompanies.forEach((savedCompany) => {
    console.log(savedCompany);
  });
}

export async function example2() {
  const conn = await createSqliteConnection();
  const companyRepo = conn.getRepository(Company);

  const appleCompany = companyRepo.create({
    name: "Apple",
  });

  const savedAppleCompany = await companyRepo.save(appleCompany);
  const id = savedAppleCompany.id;

  const fetchedAppleCompany = await companyRepo.findOne(id);

  console.log(fetchedAppleCompany);
}

export async function example3() {
  const conn = await createSqliteConnection();
  const companyRepo = conn.getRepository(Company);

  console.log("Query all companies");
  let companies = await companyRepo.find();
  console.table(companies);

  console.log("Query all companies order by name ascending");
  companies = await companyRepo.find({
    order: {
      name: "ASC",
    },
  });

  console.table(companies);

  console.log("Query all companies where name = `Github`");
  companies = await companyRepo.find({
    where: {
      name: "Github",
    },
  });

  console.table(companies);
}

export async function example4() {
  const conn = await createSqliteConnection();
  const companyRepo = conn.getRepository(Company);

  const qb = companyRepo
    .createQueryBuilder("c")
    .where("c.name = :name", { name: "Github" });

  console.log("Query one record using query builder");
  const github = await qb.getOne();
  console.log(github);

  console.log("Query where name is Github or Gitlab");
  let gitRelated = await companyRepo
    .createQueryBuilder("c")
    .where("c.name in (:...names)", { names: ["Github", "Gitlab"] })
    .getMany();
  console.log(gitRelated);

  const gitRelated2 = await companyRepo
    .createQueryBuilder("c")
    .where("c.name = :name1 or c.name = :name2", {
      name1: "Github",
      name2: "Gitlab",
    })
    .getMany();

  console.log(gitRelated2);

  console.log("Query where name contains git");
  const gitRelated3 = await companyRepo
    .createQueryBuilder("c")
    .where("lower(c.name) LIKE :name", {
      name: "%git%",
    })
    .orderBy("name", "ASC")
    .getMany();

  const gitRelated4 = await companyRepo
    .createQueryBuilder("c")
    .select(["count(*) total"])
    .where("lower(c.name) LIKE :name", {
      name: "%git%",
    })
    .getRawOne();

  const { total } = gitRelated4;

  console.log(gitRelated4);
  console.log(total);
}

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
