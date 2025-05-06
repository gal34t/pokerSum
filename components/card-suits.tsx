export default function CardSuits() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex items-center justify-center bg-white rounded-md p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L16 10H8L12 3Z" fill="#d00000" />
          <path d="M12 3L16 10H8L12 3Z" stroke="#d00000" strokeWidth="1.5" />
          <path d="M12 21C12 21 20 15 20 10H4C4 15 12 21 12 21Z" fill="#d00000" stroke="#d00000" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="flex items-center justify-center bg-white rounded-md p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3Z"
            fill="#d00000"
          />
          <path d="M12 13L7 21H17L12 13Z" fill="#d00000" />
        </svg>
      </div>
      <div className="flex items-center justify-center bg-white rounded-md p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3C14.7614 3 17 5.23858 17 8C17 9.84871 15.9598 11.4584 14.4133 12.2757C15.9275 12.8937 17 14.3479 17 16C17 18.2091 15.2091 20 13 20H11C8.79086 20 7 18.2091 7 16C7 14.3479 8.07254 12.8937 9.58666 12.2757C8.04022 11.4584 7 9.84871 7 8C7 5.23858 9.23858 3 12 3Z"
            fill="black"
          />
        </svg>
      </div>
      <div className="flex items-center justify-center bg-white rounded-md p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L16 10L12 17L8 10L12 3Z" fill="black" stroke="black" strokeWidth="1.5" />
          <path d="M12 17V21" stroke="black" strokeWidth="1.5" />
          <path d="M10 19H14" stroke="black" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}
