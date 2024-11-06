import React, { useContext, useState } from "react"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Input,
  Card,
  useDisclosure,
	RadioGroup,
	Radio,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@nextui-org/react"
import { ThemeContext } from "../theme-provider"
import { FaMoon, FaSearch, FaSun } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logout, selectIsAuth } from "../../features/user/userSlice"
import { BiLogOut } from "react-icons/bi"
import { NavButton } from "../nav-button"
import {
  useAllUsersQuery,
  useLazyAllUsersQuery,
} from "../../app/services/userApi"
import { useForm } from "react-hook-form"
import axios from "axios"
import { User } from "../../app/types"

type FormValues = {
  email: string
}

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [triggerAllUsers] = useLazyAllUsersQuery()
  const [searchResult, setSearchResult] = useState<User | null>(null)
  const { handleSubmit, register } = useForm<FormValues>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [modalPlacement, setModalPlacement] = React.useState("auto")

  const handleFormSubmit = async (data: FormValues) => {
    try {
      const { email } = data
      console.log("Отправляем запрос с email:", email)
      const res = await triggerAllUsers(email).unwrap()
      setSearchResult(res)
      console.log("Результат запроса:", res)
    } catch (error: any) {
      console.error("Ошибка при поиске пользователя:", error)
    }
  }

  function handleLogout() {
    try {
      dispatch(logout())
      localStorage.removeItem("token")
      navigate("/auth")
    } catch (error) {
      console.log(error, "Logout error!")
    }
  }
  return (
    <Navbar className="pt-4">
      <NavbarBrand>
        <p className="font-bold text-inherit">My social-app</p>
      </NavbarBrand>

      <div className="flex flex-col">
        <NavbarContent>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex gap-2 w-full"
          >
            <Input
              radius="md"
              type="text"
              placeholder="Enter username"
              defaultValue="nick@mail.ru"
              className="max-w-[620px]"
              {...register("email")}
            />
            <Button type="submit" size="md" color="primary">
              <FaSearch />
            </Button>
          </form>
        </NavbarContent>

        {searchResult && (
          // <Card className="mt-4 rounded-lg px-2 py-1">
          //   <div className="">
          //     <div className="">
          //       <div>
          //         <img src={searchResult?.avatarUrl} alt="" />
          //       </div>

          //       <div className="text-center">
          //         <Link to={`/users/${searchResult?._id}`} state={{userData: searchResult}}>
          //           {searchResult?.email}
          //         </Link>
          //       </div>
          //     </div>
          //   </div>
          // </Card>
          <div className="flex flex-col gap-2">
            <Button onPress={onOpen} className="max-w-fit">
              Open Modal
            </Button>
            <Modal
              isOpen={isOpen}
              placement="top-center"
              onOpenChange={onOpenChange}
            >
              <ModalContent>
                {onClose => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Modal Title
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam pulvinar risus non risus hendrerit venenatis.
                        Pellentesque sit amet hendrerit risus, sed porttitor
                        quam.
                      </p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam pulvinar risus non risus hendrerit venenatis.
                        Pellentesque sit amet hendrerit risus, sed porttitor
                        quam.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={onClose}>
                        Action
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        )}
      </div>

      <NavbarContent justify="end">
        <NavbarItem
          className="hidden cursor-pointer lg:flex mr-4"
          onClick={() => toggleTheme()}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </NavbarItem>
        <NavbarItem className=" lg:flex">
          {isAuth && (
            <Button
              onClick={handleLogout}
              variant="flat"
              className="bg-red-800 gap-2 text-base items-center"
            >
              <span>
                <BiLogOut size={20} />
              </span>
              Выйти
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default Header
