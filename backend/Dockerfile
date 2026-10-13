# ==============================================================================
# LastZone Spring Boot Backend - Production Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build JAR with Maven & Java 21
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven descriptor and download dependencies (cache layer)
COPY pom.xml .
# Copy backend source tree
COPY src ./src

# Install maven and package application
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Security: Run as dedicated non-root user
RUN addgroup -S lastzone && adduser -S lastzone -G lastzone

COPY --from=builder /build/target/lastzone-backend-1.0.0.jar app.jar

RUN chown -R lastzone:lastzone /app

USER lastzone

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
