\documentclass{article}
\usepackage{hyperref}
\usepackage{listings}
\usepackage{xcolor}

% Set colors for code listings
\definecolor{codegray}{rgb}{0.5,0.5,0.5}
\definecolor{codepurple}{rgb}{0.58,0,0.82}
\definecolor{backcolour}{rgb}{0.95,0.95,0.92}

\lstset{
  backgroundcolor=\color{backcolour},
  commentstyle=\color{codegray},
  keywordstyle=\color{codepurple},
  numberstyle=\tiny\color{codegray},
  stringstyle=\color{codepurple},
  basicstyle=\ttfamily\footnotesize,
  breakatwhitespace=false,
  breaklines=true,
  captionpos=b,
  keepspaces=true,
  numbers=left,
  numbersep=5pt,
  showspaces=false,
  showstringspaces=false,
  showtabs=false,
  tabsize=2
}

\title{ChatApp Documentation}
\author{rRahul0}
\date{\today}

\begin{document}

\maketitle

\tableofcontents

\newpage

\section{Introduction}

ChatApp is a real-time chat application built using the MERN stack (MongoDB, Express.js, React, and Node.js) with Socket.io for real-time communication. This app includes features like JWT authentication, real-time user status updates, and message encryption, making it a secure and efficient communication platform.

\section{Features}

\begin{itemize}
    \item \textbf{Real-time Messaging:} Instant messaging using Socket.io.
    \item \textbf{User Authentication:} Secure JWT-based authentication for user login and registration.
    \item \textbf{Online/Offline Status:} Displays user status in real-time.
    \item \textbf{Chat History:} Shows the last message and timestamp for each contact.
    \item \textbf{User-Created Channels:} Allows users to create and manage channels.
    \item \textbf{Encrypted Messaging:} Ensures messages are secure with encryption.
    \item \textbf{File Sharing:} Users can send and download files within the chat.
    \item \textbf{Debounced Search:} Efficient user search with debouncing to reduce unnecessary server calls.
\end{itemize}

\section{Installation}

To set up the ChatApp locally, follow these steps:

\subsection{Clone the Repository}

\begin{lstlisting}[language=bash]
git clone https://github.com/rRahul0/ChatApp.git
cd ChatApp
\end{lstlisting}

\subsection{Install Backend Dependencies}

Navigate to the backend directory and install the required dependencies:

\begin{lstlisting}[language=bash]
cd server
npm install
\end{lstlisting}

\subsection{Install Frontend Dependencies}

Navigate to the frontend directory and install the required dependencies:

\begin{lstlisting}[language=bash]
cd ../client
npm install
\end{lstlisting}

\subsection{Environment Variables}

Create a \texttt{.env} file in the \texttt{server} directory and add the following environment variables:

\begin{lstlisting}[language=bash]
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SOCKET_PORT=your_socket_port
\end{lstlisting}

\subsection{Start the Application}

Start both the backend and frontend servers:

\begin{itemize}
    \item Backend (Server):

    \begin{lstlisting}[language=bash]
    cd server
    npm run start
    \end{lstlisting}

    \item Frontend (Client):

    \begin{lstlisting}[language=bash]
    cd ../client
    npm start
    \end{lstlisting}
\end{itemize}

The application will run on \url{http://localhost:3000}.

\section{Usage}

\begin{itemize}
    \item \textbf{Sign Up/Login:} Users can register or log in using their credentials.
    \item \textbf{Chat:} Start chatting with other online users.
    \item \textbf{Create Channels:} Create and manage your own chat channels.
    \item \textbf{Send Files:} Share files with other users in the chat.
\end{itemize}

\section{Project Structure}

Here’s an overview of the project's directory structure:

\begin{lstlisting}
ChatApp/
├── client/              # Frontend React application
│   ├── public/          # Public assets
│   ├── src/             # React components and Redux setup
│   │   ├── actions/     # Redux actions
│   │   ├── components/  # React components
│   │   ├── reducers/    # Redux reducers
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   └── package.json     # Frontend dependencies
├── server/              # Backend Express application
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── socket/          # Socket.io setup
│   ├── index.js         # Server entry point
│   └── package.json     # Backend dependencies
└── README.md            # Project documentation
\end{lstlisting}

\section{API Endpoints}

Here are some of the key API endpoints available in the ChatApp:

\subsection{User Authentication}

\begin{itemize}
    \item \texttt{POST /api/auth/register}: Register a new user.
    \item \texttt{POST /api/auth/login}: Login for existing users.
\end{itemize}

\subsection{User Management}

\begin{itemize}
    \item \texttt{GET /api/users/}: Get a list of all users.
    \item \texttt{GET /api/users/:id}: Get details of a specific user.
\end{itemize}

\subsection{Messages}

\begin{itemize}
    \item \texttt{POST /api/messages/}: Send a new message.
    \item \texttt{GET /api/messages/:chatId}: Get all messages from a specific chat.
\end{itemize}

\subsection{Channels}

\begin{itemize}
    \item \texttt{POST /api/channels/}: Create a new channel.
    \item \texttt{GET /api/channels/}: Get a list of all channels.
\end{itemize}

\section{Contributing}

Contributions are welcome! Please follow these steps:

\begin{enumerate}
    \item Fork the repository.
    \item Create a new branch (\texttt{git checkout -b feature-branch-name}).
    \item Make your changes.
    \item Commit your changes (\texttt{git commit -m 'Add some feature'}).
    \item Push to the branch (\texttt{git push origin feature-branch-name}).
    \item Create a pull request.
\end{enumerate}

\section{License}

This project is licensed under the MIT License - see the \texttt{LICENSE} file for details.

\end{document}
