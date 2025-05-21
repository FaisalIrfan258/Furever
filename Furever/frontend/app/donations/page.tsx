"use client"

import { useState, useEffect } from "react"
import { donationsAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart, DollarSign, Calendar, Building, User, Gift, 
  CreditCard, RefreshCcw, Sparkles, Award
} from "lucide-react"

export default function DonationsPage() {
  const [donations, setDonations] = useState([])
  const [totalDonated, setTotalDonated] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [activeTab, setActiveTab] = useState("donate")

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    setLoading(true)
    try {
      const response = await donationsAPI.getUserDonations()
      if (response.data && response.data.donations) {
        setDonations(response.data.donations)
        setTotalDonated(response.data.totalDonated || 0)
      } else if (response.data && Array.isArray(response.data)) {
        setDonations(response.data)
        setTotalDonated(0) // Would need to calculate total manually in this case
      } else {
        setDonations([])
        setTotalDonated(0)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch donation history. Please try again.",
        variant: "destructive"
      })
      setDonations([])
      setTotalDonated(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      const finalAmount = donationAmount === "custom" 
        ? parseFloat(customAmount) 
        : parseFloat(donationAmount)
      
      if (isNaN(finalAmount) || finalAmount <= 0) {
        throw new Error("Please enter a valid donation amount")
      }
      
      const data = {
        amount: finalAmount,
        shelter: formData.get("shelter") as string || undefined,
        paymentMethod: formData.get("paymentMethod") as string,
        isRecurring,
        isAnonymous,
        dedicatedTo: formData.get("dedicatedTo") as string || undefined,
        message: formData.get("message") as string || undefined,
        paymentInfo: {
          // In a real app, this would come from a payment processor
          transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`,
          status: "completed"
        }
      }

      const response = await donationsAPI.createDonation(data)
      
      toast({
        title: "Thank you for your donation!",
        description: `Your donation of $${finalAmount.toFixed(2)} has been processed successfully.`,
        variant: "default"
      })
      
      // Reset form
      setDonationAmount("")
      setCustomAmount("")
      setIsRecurring(false)
      setIsAnonymous(false)
      const form = e.target as HTMLFormElement;
      form.reset();
      
      // Refresh donation history
      fetchDonations()
      
      // Show receipt
      if (response.data && response.data.receipt) {
        // In a real app, you might open the receipt URL or show a modal
        console.log("Receipt URL:", response.data.receipt.receiptUrl)
      }
      
      // Switch to history tab
      setActiveTab("history")
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process donation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleAmountSelect = (amount: string) => {
    setDonationAmount(amount)
    if (amount !== "custom") {
      setCustomAmount("")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-rose-600 p-8 rounded-lg mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Make a Difference Today</h1>
        <p className="text-xl">Your donation helps animals in need find their forever homes</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="donate" className="text-lg py-3">
            <Heart className="mr-2 h-5 w-5" />
            Donate Now
          </TabsTrigger>
          <TabsTrigger value="history" className="text-lg py-3">
            <Calendar className="mr-2 h-5 w-5" />
            Donation History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="donate">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                  <CardTitle className="text-2xl font-bold text-purple-700">Make a Donation</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-700 mb-4">Choose Donation Amount</h3>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {["10", "25", "50", "100", "250", "custom"].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={donationAmount === amount ? "default" : "outline"}
                            className={`h-12 ${donationAmount === amount ? "bg-purple-600 hover:bg-purple-700" : "border-purple-200 text-purple-700 hover:bg-purple-50"}`}
                            onClick={() => handleAmountSelect(amount)}
                          >
                            {amount === "custom" ? "Custom" : `$${amount}`}
                          </Button>
                        ))}
                      </div>
                      
                      {donationAmount === "custom" && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">Enter custom amount</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              className="pl-10 border-purple-200 focus:border-purple-400"
                              placeholder="Enter amount"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Payment Method</label>
                        <Select name="paymentMethod" required>
                          <SelectTrigger className="border-purple-200 focus:border-purple-400">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Credit Card">Credit Card</SelectItem>
                            <SelectItem value="PayPal">PayPal</SelectItem>
                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Building className="inline-block h-4 w-4 mr-1" />
                          Shelter (Optional)
                        </label>
                        <Select name="shelter">
                          <SelectTrigger className="border-purple-200 focus:border-purple-400">
                            <SelectValue placeholder="Select a shelter or leave blank for general donation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shelter-1">Happy Paws Shelter</SelectItem>
                            <SelectItem value="shelter-2">Furry Friends Rescue</SelectItem>
                            <SelectItem value="shelter-3">Second Chance Animal Shelter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Gift className="inline-block h-4 w-4 mr-1" />
                          Dedicated To (Optional)
                        </label>
                        <Input 
                          name="dedicatedTo" 
                          placeholder="e.g., In memory of Fluffy" 
                          className="border-purple-200 focus:border-purple-400" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                        <Textarea 
                          name="message" 
                          placeholder="Add a personal message with your donation" 
                          className="border-purple-200 focus:border-purple-400" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <RefreshCcw className="h-5 w-5 text-purple-600" />
                          <div>
                            <h4 className="font-medium">Make this recurring</h4>
                            <p className="text-sm text-gray-500">Monthly donation on this date</p>
                          </div>
                        </div>
                        <Switch
                          checked={isRecurring}
                          onCheckedChange={setIsRecurring}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-purple-600" />
                          <div>
                            <h4 className="font-medium">Make this donation anonymous</h4>
                            <p className="text-sm text-gray-500">Your name will not be publicly displayed</p>
                          </div>
                        </div>
                        <Switch
                          checked={isAnonymous}
                          onCheckedChange={setIsAnonymous}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting || !donationAmount || (donationAmount === "custom" && !customAmount)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
                    >
                      {submitting ? "Processing..." : "Complete Donation"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="border-pink-200 shadow-md">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 border-b border-pink-100">
                  <CardTitle className="text-xl font-bold text-pink-700">Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <h3 className="text-sm font-medium text-pink-700 mb-1">Total Donated</h3>
                      <p className="text-3xl font-bold text-pink-600">${totalDonated.toFixed(2)}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-700">Your Donation Helps:</h3>
                      <div className="flex items-start space-x-3">
                        <div className="rounded-full bg-pink-100 p-2 mt-1">
                          <Sparkles className="h-4 w-4 text-pink-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Provide Food & Shelter</h4>
                          <p className="text-sm text-gray-500">Daily care for animals in need</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="rounded-full bg-purple-100 p-2 mt-1">
                          <Heart className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Medical Treatments</h4>
                          <p className="text-sm text-gray-500">Vaccinations and emergency care</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="rounded-full bg-blue-100 p-2 mt-1">
                          <Award className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Rescue Operations</h4>
                          <p className="text-sm text-gray-500">Saving animals from harmful situations</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 text-center">
                      <p className="text-sm font-medium text-purple-800">
                        Thank you for making a difference in the lives of animals!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-2xl font-bold text-blue-700">Your Donation History</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  {donations.length === 0 ? (
                    <div className="text-center p-12 bg-gray-50 rounded-lg">
                      <h3 className="text-xl font-medium mb-2">No donations yet</h3>
                      <p className="text-gray-500 mb-4">Make your first donation today to help animals in need</p>
                      <Button 
                        onClick={() => setActiveTab("donate")}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Make a Donation
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-bold">Lifetime Impact</h3>
                          <p className="text-sm text-gray-500">Thank you for your generosity</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-purple-600">${totalDonated.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Total donated</p>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {donations.map((donation: any) => (
                          <div key={donation._id} className="py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <DollarSign className="h-5 w-5 text-green-500 mr-1" />
                                  <span className="text-xl font-bold">${donation.amount.toFixed(2)}</span>
                                  {donation.isRecurring && (
                                    <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                      <RefreshCcw className="h-3 w-3 mr-1" />
                                      Recurring
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{formatDate(donation.createdAt)}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center">
                                  <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-sm text-gray-600">{donation.paymentMethod}</span>
                                </div>
                                
                                {donation.shelter && (
                                  <div className="flex items-center mt-1">
                                    <Building className="h-4 w-4 text-gray-400 mr-1" />
                                    <span className="text-sm text-gray-600">{donation.shelter.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {(donation.dedicatedTo || donation.message) && (
                              <div className="mt-2 p-3 bg-purple-50 rounded-md text-sm">
                                {donation.dedicatedTo && (
                                  <p className="font-medium text-purple-700">Dedicated to: {donation.dedicatedTo}</p>
                                )}
                                {donation.message && (
                                  <p className="text-gray-600 mt-1">"{donation.message}"</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 