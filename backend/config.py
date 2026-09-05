from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "IHC Grupo 2 API"
    API_V1_STR: str = "/api/v1"
    
    GITHUB_TOKEN: str
    PROJECT_OWNER: str = "Interacao-Humano-Computador"
    PROJECT_REPO: str = "2026.2-Grupo02"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
settings = Settings()