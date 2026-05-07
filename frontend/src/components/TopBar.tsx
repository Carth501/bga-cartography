import { useAuth } from "../features/auth/AuthProvider";

interface TopBarProps {
  currentMapTitle: string;
  dataSource: "loading" | "api" | "fallback";
  onLoginRequest: () => void;
}

export function TopBar({ currentMapTitle, onLoginRequest }: TopBarProps) {
  const { isAdmin, logout } = useAuth();

  return (
    <header className="topbar d-flex align-items-center justify-content-between border-bottom border-secondary-subtle px-4 py-3">
      <div>
        <p className="eyebrow mb-1 text-uppercase text-secondary">
          BGA Cartography
        </p>
        <h1 className="h4 mb-0">{currentMapTitle}</h1>
      </div>
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-light"
          type="button"
          onClick={isAdmin ? logout : onLoginRequest}
        >
          {isAdmin ? "Log Out" : "Admin Login"}
        </button>
      </div>
    </header>
  );
}
