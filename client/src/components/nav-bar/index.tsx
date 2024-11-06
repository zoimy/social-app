import React from "react"
import { NavButton } from "../nav-button"
import { BsPostcard } from "react-icons/bs"
import { FiUsers } from "react-icons/fi"
import { FaUsers } from "react-icons/fa"
import { useLocation } from "react-router-dom"

const NavBar: React.FC = () => {
  const location = useLocation()

  const currentPath = location.pathname

  return (
    <nav>
      <ul className="flex flex-col gap-5">
        <li>
          <NavButton
            href="/"
            icon={<BsPostcard />}
            isActive={currentPath == "/"}
          >
            Посты
          </NavButton>
        </li>
        <li>
          <NavButton
            href="following"
            icon={<FiUsers />}
            isActive={currentPath == "/following"}
          >
            Подписки
          </NavButton>
        </li>
        <li>
          <NavButton
            href="followers"
            icon={<FaUsers />}
            isActive={currentPath == "/followers"}
          >
            Подписчики
          </NavButton>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
