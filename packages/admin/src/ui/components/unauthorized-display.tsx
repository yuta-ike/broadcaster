import { Link } from "waku"

export const UnauthorizedDisplay = () => {
  return (
    <div className="gapp-4 flex max-w-sm flex-col">
      <h2>Unauthorized</h2>
      <Link to="/signin" className="text-blue-600 underline">
        Sign In
      </Link>
    </div>
  )
}
