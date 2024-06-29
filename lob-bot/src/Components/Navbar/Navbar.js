import Link from "next/link"
export default function Navbar(){
    return (
        <nav className="shadow px-4 py-2 flex flex-row justify-between items-center">
      <div className="text-xl font-bold ">Language Lounge</div>
      <div>
       <Link href={"/login"}>Sign In</Link>
      </div>
    </nav>
    )
}