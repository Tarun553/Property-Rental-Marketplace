"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitApplication } from "@/hooks/useApplications";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const formSchema = z.object({
  occupation: z.string().min(2, "Occupation is required"),
  employer: z.string().min(2, "Employer is required"),
  annualIncome: z.string().min(1, "Annual income is required"),
  moveInDate: z.string().min(1, "Move-in date is required"),

  // Reference 1
  ref1Name: z.string().min(2, "Reference name is required"),
  ref1Relationship: z.string().min(2, "Relationship is required"),
  ref1Phone: z.string().min(10, "Phone number is required"),
  ref1Email: z.string().email("Valid email is required"),

  // Reference 2
  ref2Name: z.string().min(2, "Reference name is required"),
  ref2Relationship: z.string().min(2, "Relationship is required"),
  ref2Phone: z.string().min(10, "Phone number is required"),
  ref2Email: z.string().email("Valid email is required"),

  // Optional
  additionalInfo: z.string().optional(),
});

interface ApplicationFormProps {
  propertyId: string;
  onSuccess?: () => void;
}

export function ApplicationForm({
  propertyId,
  onSuccess,
}: ApplicationFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const mutation = useSubmitApplication();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      occupation: "",
      employer: "",
      annualIncome: "",
      moveInDate: "",
      ref1Name: "",
      ref1Relationship: "",
      ref1Phone: "",
      ref1Email: "",
      ref2Name: "",
      ref2Relationship: "",
      ref2Phone: "",
      ref2Email: "",
      additionalInfo: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const applicationData = {
        property: propertyId,
        personalInfo: {
          occupation: values.occupation,
          employer: values.employer,
          annualIncome: Number(values.annualIncome),
          moveInDate: values.moveInDate,
        },
        references: [
          {
            name: values.ref1Name,
            relationship: values.ref1Relationship,
            phone: values.ref1Phone,
            email: values.ref1Email,
          },
          {
            name: values.ref2Name,
            relationship: values.ref2Relationship,
            phone: values.ref2Phone,
            email: values.ref2Email,
          },
        ],
        additionalInfo: values.additionalInfo,
      };

      await mutation.mutateAsync({ formData: applicationData, files });
      toast.success("Application submitted successfully!");
      form.reset();
      setFiles([]);
      onSuccess?.();
    } catch (error: any) {
      console.error("Application error:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to submit application",
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation *</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer *</FormLabel>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="annualIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income ($) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="60000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="moveInDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Move-in Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* References */}
        <Card>
          <CardHeader>
            <CardTitle>References (2 Required)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reference 1 */}
            <div className="space-y-4 pb-4 border-b">
              <h4 className="font-semibold">Reference 1</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ref1Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ref1Relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship *</FormLabel>
                      <FormControl>
                        <Input placeholder="Former Landlord" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ref1Phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ref1Email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Reference 2 */}
            <div className="space-y-4">
              <h4 className="font-semibold">Reference 2</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ref2Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ref2Relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship *</FormLabel>
                      <FormControl>
                        <Input placeholder="Employer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ref2Phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ref2Email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Any additional information you&apos;d like to share
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about yourself, pets, special requirements, etc."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Documents
                    </span>
                  </Button>
                </label>
                <p className="text-sm text-gray-500">
                  ID, proof of income, references, etc.
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
