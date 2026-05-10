package com.thenexus.backend.notification.service;

import com.thenexus.backend.config.MailProperties;
import com.thenexus.backend.notification.domain.NotificationJob;
import com.thenexus.backend.notification.repository.NotificationJobRepository;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
  private final NotificationJobRepository notificationJobRepository;
  private final JavaMailSender mailSender;
  private final MailProperties mailProperties;

  public NotificationService(NotificationJobRepository notificationJobRepository, JavaMailSender mailSender,
      MailProperties mailProperties) {
    this.notificationJobRepository = notificationJobRepository; this.mailSender = mailSender; this.mailProperties = mailProperties;
  }

  @Transactional
  public NotificationJob queue(String recipientEmail, String templateKey, String subject, String payload) {
    return notificationJobRepository.save(new NotificationJob(recipientEmail, templateKey, subject, payload));
  }

  @Transactional
  public void sendNow(NotificationJob job, String htmlBody) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
      helper.setTo(job.getRecipientEmail());
      helper.setFrom(mailProperties.getFromEmail(), mailProperties.getFromName());
      helper.setSubject(job.getSubject());
      helper.setText(htmlBody, true);
      mailSender.send(message);
      job.markSent();
    } catch (Exception exception) {
      job.markFailed(exception.getMessage());
    }
  }

}
