"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Brain, Wallet, CheckCircle, GraduationCap, Award, User, Send, BookOpen, Trophy } from "lucide-react"

declare global {
  interface Window {
    ethereum?: any
  }
}

interface Course {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  topics: string[]
  completed?: boolean
  progress?: number
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface NFTCredential {
  id: string
  courseName: string
  issueDate: string
  tokenId: string
  verified: boolean
}

export default function ProofOfHumanityLearning() {
  const [account, setAccount] = useState<string>("")
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [currentView, setCurrentView] = useState<"dashboard" | "course" | "quiz" | "credentials">("dashboard")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isAIResponding, setIsAIResponding] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [credentials, setCredentials] = useState<NFTCredential[]>([])

  const courses: Course[] = [
    {
      id: "web3-basics",
      title: "Web3 Fundamentals",
      description: "Learn the basics of blockchain, DeFi, and decentralized applications",
      duration: "2 hours",
      difficulty: "Beginner",
      topics: ["Blockchain Basics", "Smart Contracts", "DeFi Protocols", "NFTs"],
      progress: 0,
    },
    {
      id: "defi-advanced",
      title: "Advanced DeFi Strategies",
      description: "Deep dive into yield farming, liquidity provision, and protocol governance",
      duration: "4 hours",
      difficulty: "Advanced",
      topics: ["Yield Farming", "Liquidity Mining", "Governance Tokens", "Risk Management"],
      progress: 0,
    },
    {
      id: "nft-creation",
      title: "NFT Creation & Marketplace",
      description: "Create, mint, and trade NFTs on various blockchain networks",
      duration: "3 hours",
      difficulty: "Intermediate",
      topics: ["NFT Standards", "Minting Process", "Marketplace Integration", "Royalties"],
      progress: 0,
    },
  ]

  const quizQuestions = [
    {
      id: "q1",
      question: "What is a blockchain?",
      options: [
        "A centralized database",
        "A distributed ledger technology",
        "A type of cryptocurrency",
        "A smart contract platform",
      ],
      correct: 1,
    },
    {
      id: "q2",
      question: "What makes an NFT 'soulbound'?",
      options: [
        "It's very expensive",
        "It cannot be transferred to another wallet",
        "It's stored on multiple blockchains",
        "It requires special software to view",
      ],
      correct: 1,
    },
    {
      id: "q3",
      question: "What is the main purpose of DeFi?",
      options: [
        "To replace traditional banking",
        "To create new cryptocurrencies",
        "To provide financial services without intermediaries",
        "To mine Bitcoin faster",
      ],
      correct: 2,
    },
  ]

  useEffect(() => {
    checkConnection()
    // Simulate some existing credentials
    setCredentials([
      {
        id: "1",
        courseName: "Blockchain Basics",
        issueDate: "2024-01-15",
        tokenId: "0x1234...5678",
        verified: true,
      },
    ])
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          // Simulate verification status
          setIsVerified(true)
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
      setIsConnected(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const verifyHumanity = async () => {
    // Simulate human verification process
    setIsVerified(true)
    alert("Human verification successful! You can now access courses.")
  }

  const startCourse = (course: Course) => {
    setSelectedCourse(course)
    setCurrentView("course")
    setChatMessages([
      {
        role: "assistant",
        content: `Welcome to ${course.title}! I'm your AI tutor powered by 0G's compute network. I'll guide you through this course step by step. What would you like to learn first?`,
        timestamp: new Date(),
      },
    ])
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsAIResponding(true)

    // Simulate AI response using 0G compute
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: "assistant",
        content: generateAIResponse(currentMessage, selectedCourse),
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiResponse])
      setIsAIResponding(false)
    }, 1500)
  }

  const generateAIResponse = (message: string, course: Course | null): string => {
    const responses = [
      `Great question! In ${course?.title}, this concept is fundamental. Let me explain it in simple terms...`,
      `That's an excellent point to explore. Based on the course material, here's what you need to know...`,
      `I can see you're thinking deeply about this topic. Let's break it down step by step...`,
      `This is a common question in ${course?.title}. The key thing to understand is...`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const startQuiz = () => {
    setCurrentView("quiz")
  }

  const submitQuiz = async () => {
    const correctAnswers = quizQuestions.filter(
      (q, index) => Number.parseInt(quizAnswers[q.id] || "0") === q.correct,
    ).length

    const passed = correctAnswers >= 2 // Need 2/3 to pass

    if (passed) {
      // Simulate NFT minting
      const newCredential: NFTCredential = {
        id: Date.now().toString(),
        courseName: selectedCourse?.title || "Course",
        issueDate: new Date().toISOString().split("T")[0],
        tokenId: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
        verified: true,
      }

      setCredentials((prev) => [...prev, newCredential])
      alert(`Congratulations! You passed the quiz and earned your soulbound NFT credential. Score: ${correctAnswers}/3`)
      setCurrentView("credentials")
    } else {
      alert(`You need to score at least 2/3 to pass. Your score: ${correctAnswers}/3. Please try again!`)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Proof of Humanity Learning Passport</h1>
          <p className="text-slate-300 text-lg mb-8">
            Earn verifiable, soulbound NFT credentials by completing AI-tutored courses. Only real, verified humans can
            earn these permanent learning certificates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="bg-slate-800 p-4 rounded-lg">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-white font-semibold">AI-Powered Learning</div>
              <div className="text-slate-400">Personal AI tutor using 0G compute</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <User className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-white font-semibold">Human Verification</div>
              <div className="text-slate-400">Prove you're real before earning</div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-white font-semibold">Soulbound NFTs</div>
              <div className="text-slate-400">Permanent, non-transferable credentials</div>
            </div>
          </div>
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Wallet className="w-5 h-5 mr-2" />
            {isConnecting ? "Connecting..." : "Connect MetaMask to Start Learning"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Learning Passport</h1>
              <p className="text-slate-400 text-sm">Proof of Humanity Credentials</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${isVerified ? "bg-green-500" : "bg-yellow-500"}`}></div>
              <span className="text-white text-sm">{formatAddress(account)}</span>
              {isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
            {!isVerified && (
              <Button onClick={verifyHumanity} className="bg-blue-600 hover:bg-blue-700">
                <User className="w-4 h-4 mr-2" />
                Verify Human
              </Button>
            )}
            <Button
              onClick={() => {
                setAccount("")
                setIsConnected(false)
                setIsVerified(false)
                setCurrentView("dashboard")
                setSelectedCourse(null)
                setChatMessages([])
                setQuizAnswers({})
              }}
              variant="outline"
              className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {!isVerified ? (
          <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-white">Human Verification Required</CardTitle>
              <CardDescription className="text-slate-400">
                Please verify your humanity to access courses and earn credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={verifyHumanity} className="bg-blue-600 hover:bg-blue-700">
                <User className="w-4 h-4 mr-2" />
                Start Verification Process
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="dashboard" className="text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="course" className="text-white" disabled={!selectedCourse}>
                <Brain className="w-4 h-4 mr-2" />
                AI Tutor
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-white" disabled={!selectedCourse}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Assessment
              </TabsTrigger>
              <TabsTrigger value="credentials" className="text-white">
                <Trophy className="w-4 h-4 mr-2" />
                Credentials
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                        <Badge
                          variant={
                            course.difficulty === "Beginner"
                              ? "default"
                              : course.difficulty === "Intermediate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {course.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-400">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm text-slate-300">
                        <span>Duration: {course.duration}</span>
                        <span>Progress: {course.progress || 0}%</span>
                      </div>
                      <Progress value={course.progress || 0} className="h-2" />
                      <div className="flex flex-wrap gap-1">
                        {course.topics.map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <Button onClick={() => startCourse(course)} className="w-full bg-purple-600 hover:bg-purple-700">
                        {course.progress ? "Continue Course" : "Start Course"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="course" className="space-y-6">
              {selectedCourse && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-slate-800 border-slate-700 h-96">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Brain className="w-5 h-5 mr-2 text-purple-400" />
                          AI Tutor - {selectedCourse.title}
                        </CardTitle>
                        <CardDescription className="text-slate-400">Powered by 0G Compute Network</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                          {chatMessages.map((message, idx) => (
                            <div
                              key={idx}
                              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.role === "user" ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-200"
                                }`}
                              >
                                {message.content}
                              </div>
                            </div>
                          ))}
                          {isAIResponding && (
                            <div className="flex justify-start">
                              <div className="bg-slate-700 text-slate-200 px-4 py-2 rounded-lg">AI is thinking...</div>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Input
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Ask your AI tutor anything..."
                            className="bg-slate-700 border-slate-600 text-white"
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          />
                          <Button onClick={sendMessage} disabled={isAIResponding}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-4">
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Course Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Progress value={selectedCourse.progress || 0} className="mb-2" />
                        <p className="text-slate-400 text-sm">{selectedCourse.progress || 0}% Complete</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Ready for Assessment?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400 text-sm mb-4">
                          Complete the quiz to earn your soulbound NFT credential
                        </p>
                        <Button onClick={startQuiz} className="w-full bg-green-600 hover:bg-green-700">
                          Take Quiz
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="quiz" className="space-y-6">
              <Card className="bg-slate-800 border-slate-700 max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-white">Course Assessment</CardTitle>
                  <CardDescription className="text-slate-400">
                    Answer at least 2 out of 3 questions correctly to earn your NFT credential
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {quizQuestions.map((question, idx) => (
                    <div key={question.id} className="space-y-3">
                      <h3 className="text-white font-semibold">
                        {idx + 1}. {question.question}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => (
                          <label key={optIdx} className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value={optIdx}
                              onChange={(e) =>
                                setQuizAnswers((prev) => ({
                                  ...prev,
                                  [question.id]: e.target.value,
                                }))
                              }
                              className="text-purple-600"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button onClick={submitQuiz} className="w-full bg-green-600 hover:bg-green-700">
                    Submit Quiz & Mint NFT
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credentials" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.map((credential) => (
                  <Card key={credential.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white text-lg">{credential.courseName}</CardTitle>
                        {credential.verified && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>
                      <CardDescription className="text-slate-400">Soulbound NFT Credential</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-slate-300">
                        <div>Issue Date: {credential.issueDate}</div>
                        <div>Token ID: {credential.tokenId}</div>
                        <div className="flex items-center mt-2">
                          <Badge variant="default" className="bg-green-600">
                            Verified Human
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        View on Explorer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {credentials.length === 0 && (
                  <Card className="bg-slate-800 border-slate-700 col-span-full">
                    <CardContent className="text-center py-8">
                      <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No credentials earned yet. Complete a course to get started!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
