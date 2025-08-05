import os from "os";
import fs, { write } from "fs";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(currentUser: string) {
  const config = readConfig();
  config.currentUserName = currentUser;
  writeConfig(config);
}

export function readConfig(): Config {
  const fullPath = getConfigFilePath();

  const data = fs.readFileSync(fullPath, "utf-8");
  const rawConfig = JSON.parse(data);

  return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
  const homeDir = os.homedir();
  const configFileName = ".gatorconfig.json";

  return path.join(homeDir, configFileName);
}

function writeConfig(cfg: Config): void {
  const filePath = getConfigFilePath();
  const rawConfig: any = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  const data = JSON.stringify(rawConfig);
  fs.writeFileSync(filePath, data);
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file.");
  }

  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file.");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}
